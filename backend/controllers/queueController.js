import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/admin.js";
import Counter from "../models/Counter.js";
import Office from "../models/Office.js";
import Queue from "../models/Queue.js";
import SwapRequest from "../models/SwapRequest.js";
import User from "../models/user.js";
import Notification from "../models/Notification.js";
import { createNotification } from "../services/notificationService.js";

const JWT_SECRET = process.env.JWT_SECRET || "queue-dev-secret";

const streamSubscribers = new Map();

const DEMO_PERSONAS = [
  {
    key: "prakul",
    role: "USER",
    name: "Prakul",
    email: "prakul.demo@quenest.app",
    mobile: "9000000001"
  },
  {
    key: "user2",
    role: "USER",
    name: "User 2",
    email: "user2.demo@quenest.app",
    mobile: "9000000002"
  },
  {
    key: "user3",
    role: "USER",
    name: "User 3",
    email: "user3.demo@quenest.app",
    mobile: "9000000003"
  },
  {
    key: "sbi-admin",
    role: "ADMIN",
    name: "SBI Admin",
    email: "sbi.admin.demo@quenest.app",
    mobile: "9111111111"
  },
  {
    key: "hdfc-admin",
    role: "ADMIN",
    name: "HDFC Admin",
    email: "hdfc.admin.demo@quenest.app",
    mobile: "9222222222"
  },
  {
    key: "icici-admin",
    role: "ADMIN",
    name: "ICICI Admin",
    email: "icici.admin.demo@quenest.app",
    mobile: "9333333333"
  },
  {
    key: "citycare-admin",
    role: "ADMIN",
    name: "City Care Admin",
    email: "citycare.admin.demo@quenest.app",
    mobile: "9444444444"
  },
  {
    key: "apollo-admin",
    role: "ADMIN",
    name: "Apollo Admin",
    email: "apollo.admin.demo@quenest.app",
    mobile: "9555555555"
  },
  {
    key: "passport-admin",
    role: "ADMIN",
    name: "Passport Admin",
    email: "passport.admin.demo@quenest.app",
    mobile: "9666666666"
  },
  {
    key: "rto-admin",
    role: "ADMIN",
    name: "RTO Admin",
    email: "rto.admin.demo@quenest.app",
    mobile: "9777777777"
  },
  {
    key: "university-admin",
    role: "ADMIN",
    name: "University Admin",
    email: "university.admin.demo@quenest.app",
    mobile: "9888888888"
  },
  {
    key: "electricity-admin",
    role: "ADMIN",
    name: "Electricity Admin",
    email: "electricity.admin.demo@quenest.app",
    mobile: "9999999999"
  }
];

const DEMO_ORGANIZATIONS = [
  {
    key: "SBI_MUMBAI",
    adminKey: "sbi-admin",
    name: "SBI Mumbai Branch",
    category: "Bank",
    location: "Mumbai",
    operatingHours: "9:00 AM - 5:00 PM",
    counters: 4,
    avgWaitingTime: 5,
    queueLimit: 80
  },
  {
    key: "HDFC_DELHI",
    adminKey: "hdfc-admin",
    name: "HDFC Delhi Branch",
    category: "Bank",
    location: "Delhi",
    operatingHours: "10:00 AM - 6:00 PM",
    counters: 3,
    avgWaitingTime: 6,
    queueLimit: 60
  },
  {
    key: "ICICI_MUMBAI",
    adminKey: "icici-admin",
    name: "ICICI Bank",
    category: "Bank",
    location: "Mumbai",
    operatingHours: "9:30 AM - 5:30 PM",
    counters: 4,
    avgWaitingTime: 6,
    queueLimit: 70
  },
  {
    key: "CITYCARE_MUMBAI",
    adminKey: "citycare-admin",
    name: "City Care Hospital",
    category: "Hospital",
    location: "Mumbai",
    operatingHours: "24 Hours",
    counters: 6,
    avgWaitingTime: 8,
    queueLimit: 120
  },
  {
    key: "APOLLO_MUMBAI",
    adminKey: "apollo-admin",
    name: "Apollo Clinic",
    category: "Hospital",
    location: "Mumbai",
    operatingHours: "8:00 AM - 8:00 PM",
    counters: 3,
    avgWaitingTime: 4,
    queueLimit: 50
  },
  {
    key: "PASSPORT_MUMBAI",
    adminKey: "passport-admin",
    name: "Passport Office",
    category: "Government",
    location: "Mumbai",
    operatingHours: "10:00 AM - 4:00 PM",
    counters: 5,
    avgWaitingTime: 5,
    queueLimit: 80
  },
  {
    key: "RTO_MUMBAI",
    adminKey: "rto-admin",
    name: "RTO Mumbai Central",
    category: "Government",
    location: "Mumbai",
    operatingHours: "9:00 AM - 5:00 PM",
    counters: 5,
    avgWaitingTime: 6,
    queueLimit: 90
  },
  {
    key: "UNIVERSITY_MUMBAI",
    adminKey: "university-admin",
    name: "Mumbai University",
    category: "Education",
    location: "Mumbai",
    operatingHours: "9:00 AM - 3:00 PM",
    counters: 4,
    avgWaitingTime: 5,
    queueLimit: 75
  },
  {
    key: "ELECTRICITY_MUMBAI",
    adminKey: "electricity-admin",
    name: "Electricity Board",
    category: "Utilities",
    location: "Mumbai",
    operatingHours: "10:00 AM - 6:00 PM",
    counters: 4,
    avgWaitingTime: 7,
    queueLimit: 85
  }
];

const ACTIVE_STATUSES = ["waiting", "serving"];
const MAX_SWAPS_PER_USER = 2;

const signToken = (id, role) =>
  jwt.sign({ id: String(id), role }, JWT_SECRET, { expiresIn: "7d" });

const getOrgSubscribers = (organizationId) =>
  streamSubscribers.get(String(organizationId)) ?? new Set();

export const broadcastOrganization = async (organizationId, event, payloadBuilder) => {
  const subscribers = getOrgSubscribers(organizationId);
  if (!subscribers.size) return;

  const payload = await payloadBuilder();
  const serialized = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;

  for (const res of subscribers) {
    res.write(serialized);
  }
};

const addSubscriber = (organizationId, res) => {
  const key = String(organizationId);
  const subscribers = getOrgSubscribers(key);
  subscribers.add(res);
  streamSubscribers.set(key, subscribers);
};

const removeSubscriber = (organizationId, res) => {
  const key = String(organizationId);
  const subscribers = getOrgSubscribers(key);
  subscribers.delete(res);
  if (!subscribers.size) {
    streamSubscribers.delete(key);
  }
};

const ensureDemoData = async () => {
  const hashedPassword = await bcrypt.hash("demo-pass-123", 10);
  const personaEntities = {};

  for (const persona of DEMO_PERSONAS) {
    const Model = persona.role === "ADMIN" ? Admin : User;
    let record = await Model.findOne({ email: persona.email });

    if (!record) {
      record = await Model.create({
        name: persona.name,
        email: persona.email,
        mobile: persona.mobile,
        password: hashedPassword
      });
    }

    personaEntities[persona.key] = record;
  }

  for (const org of DEMO_ORGANIZATIONS) {
    const admin = personaEntities[org.adminKey];

    let office = await Office.findOne({ admin: admin._id });
    if (!office) {
      office = await Office.create({
        admin: admin._id,
        createdBy: admin._id,
        name: org.name,
        category: org.category,
        location: org.location,
        operatingHours: org.operatingHours,
        counters: org.counters,
        avgServiceTime: org.avgWaitingTime,
        avgWaitingTime: org.avgWaitingTime,
        maxQueueLimit: org.queueLimit,
        queueLimit: org.queueLimit
      });
    } else {
      office.name = org.name;
      office.category = office.category ?? org.category;
      office.location = org.location;
      office.operatingHours = org.operatingHours;
      office.counters = org.counters;
      office.avgServiceTime = office.avgServiceTime ?? org.avgWaitingTime;
      office.avgWaitingTime = office.avgWaitingTime ?? org.avgWaitingTime;
      office.maxQueueLimit = office.maxQueueLimit ?? org.queueLimit;
      office.queueLimit = office.queueLimit ?? org.queueLimit;
      office.createdBy = office.createdBy ?? admin._id;
      await office.save();
    }

    await Counter.findOneAndUpdate(
      { organizationId: office._id },
      { $setOnInsert: { seq: 0 } },
      { upsert: true, new: true }
    );
  }
};

const getOrganizationById = (organizationId) =>
  Office.findById(organizationId).lean();

const getActiveQueueForUser = (userId, organizationId) =>
  Queue.findOne({
    userId,
    organizationId,
    status: { $in: ACTIVE_STATUSES }
  });

const getOpenSwapForRequester = (requesterUserId, organizationId) =>
  SwapRequest.findOne({
    requesterUserId,
    organizationId,
    status: "open"
  });

const getQueueState = async (organizationId, viewerId = null) => {
  const organization = await Office.findById(organizationId).lean();
  if (!organization) {
    throw new Error("Organization not found");
  }

  const activeEntries = await Queue.find({
    organizationId,
    status: { $in: ACTIVE_STATUSES }
  })
    .populate("userId", "name email")
    .sort({ tokenNumber: 1 })
    .lean();

  const openSwapRequests = await SwapRequest.find({
    organizationId,
    status: "open"
  })
    .populate("requesterUserId", "name email")
    .populate("responses.responderUserId", "name email")
    .sort({ createdAt: -1 })
    .lean();

  const currentServingEntry =
    activeEntries.find((entry) => entry.status === "serving") ?? null;
  const currentServingToken = currentServingEntry?.tokenNumber ?? organization.currentToken ?? 0;

  const myEntry =
    viewerId == null
      ? null
      : activeEntries.find(
          (entry) => String(entry.userId?._id ?? entry.userId) === String(viewerId)
        ) ?? null;

  const peopleAhead = myEntry
    ? activeEntries.filter(
        (entry) =>
          entry.status !== "completed" && entry.tokenNumber < myEntry.tokenNumber
      ).length
    : 0;

  return {
    organization: {
      _id: organization._id,
      name: organization.name,
      location: organization.location,
      currentServingToken,
      isPaused: organization.isPaused,
      avgWaitingTime: organization.avgWaitingTime,
      queueStatus: organization.queueStatus,
      category: organization.category,
      swapEnabled: organization.swapEnabled,
      maxSwapsPerUser: organization.maxSwapsPerUser,
      maxQueueLimit: organization.maxQueueLimit ?? organization.queueLimit
    },
    queue: activeEntries.map((entry) => ({
      _id: entry._id,
      userId: entry.userId?._id ?? entry.userId,
      userName: entry.userId?.name ?? "Unknown User",
      tokenNumber: entry.tokenNumber,
      status: entry.status,
      swapCount: entry.swapCount
    })),
    myEntry: myEntry
      ? {
          _id: myEntry._id,
          userId: myEntry.userId?._id ?? myEntry.userId,
          tokenNumber: myEntry.tokenNumber,
          status: myEntry.status,
          swapCount: myEntry.swapCount,
          peopleAhead,
          swapsRemaining: Math.max(
            0,
            (organization.maxSwapsPerUser ?? MAX_SWAPS_PER_USER) - myEntry.swapCount
          )
        }
      : null,
    swapRequests: openSwapRequests.map((request) => ({
      _id: request._id,
      requesterUserId: request.requesterUserId?._id ?? request.requesterUserId,
      requesterName: request.requesterUserId?.name ?? "Unknown User",
      requesterToken: request.requesterToken,
      message: request.message,
      createdAt: request.createdAt,
      acceptedCount: request.responses.filter(
        (response) => response.status === "accepted"
      ).length,
      responses: request.responses.map((response) => ({
        responderUserId:
          response.responderUserId?._id ?? response.responderUserId,
        responderName: response.responderUserId?.name ?? "Unknown User",
        responderToken: response.responderToken,
        status: response.status,
        respondedAt: response.respondedAt
      }))
    }))
  };
};

export const broadcastQueueState = async (organizationId) =>
  broadcastOrganization(organizationId, "queue-state", () =>
    getQueueState(organizationId)
  );

const validateSwapEligibility = (queueEntry, label) => {
  if (!queueEntry) {
    throw new Error(`${label} is not in the queue`);
  }

  if (queueEntry.status !== "waiting") {
    throw new Error(`${label} must be waiting to swap`);
  }

  const maxSwapsPerUser = queueEntry.organizationConfig?.maxSwapsPerUser ?? MAX_SWAPS_PER_USER;
  if (queueEntry.swapCount >= maxSwapsPerUser) {
    throw new Error(`${label} has reached the ${maxSwapsPerUser} swap limit`);
  }
};

export const demoLogin = async (req, res) => {
  try {
    const { personaKey } = req.body;
    await ensureDemoData();

    const persona = DEMO_PERSONAS.find((item) => item.key === personaKey);
    if (!persona) {
      return res.status(404).json({ message: "Demo persona not found" });
    }

    const Model = persona.role === "ADMIN" ? Admin : User;
    const account = await Model.findOne({ email: persona.email });

    res.json({
      token: signToken(account._id, persona.role),
      role: persona.role,
      user: {
        id: account._id,
        name: account.name,
        email: account.email,
        personaKey
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrganizations = async (req, res) => {
  try {
    await ensureDemoData();
    const organizations = await Office.find()
      .sort({ name: 1 })
      .lean();

    const activeCounts = await Queue.aggregate([
      { $match: { status: { $in: ACTIVE_STATUSES } } },
      {
        $group: {
          _id: "$organizationId",
          queueLength: { $sum: 1 }
        }
      }
    ]);

    const countMap = new Map(
      activeCounts.map((item) => [String(item._id), item.queueLength])
    );

    res.json(
      organizations.map((org) => ({
        _id: org._id,
      name: org.name,
      location: org.location,
      category: org.category,
      currentToken: org.currentToken,
      queueStatus: org.queueStatus,
      swapEnabled: org.swapEnabled,
      queueLength: countMap.get(String(org._id)) ?? 0,
      estimatedWaitTime: (countMap.get(String(org._id)) ?? 0) * org.avgWaitingTime
    }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const streamQueueUpdates = async (req, res) => {
  const { organizationId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(organizationId)) {
    return res.status(400).json({ message: "Invalid organizationId" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  addSubscriber(organizationId, res);

  const initialState = await getQueueState(organizationId, req.user.id);
  res.write(`event: queue-state\ndata: ${JSON.stringify(initialState)}\n\n`);

  const keepAlive = setInterval(() => {
    res.write("event: ping\ndata: {}\n\n");
  }, 20000);

  req.on("close", () => {
    clearInterval(keepAlive);
    removeSubscriber(organizationId, res);
    res.end();
  });
};

export const getMyProfile = async (req, res) => {
  try {
    const Model = req.user.role === "ADMIN" ? Admin : User;
    const account = await Model.findById(req.user.id).select("name email");

    res.json({
      user: {
        id: account._id,
        name: account.name,
        email: account.email,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .populate("organizationId", "name location")
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    res.json(
      notifications.map((notification) => ({
        _id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
        organizationName: notification.organizationId?.name ?? null,
        organizationLocation: notification.organizationId?.location ?? null
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrganizationState = async (req, res) => {
  try {
    const { organizationId } = req.query;
    const state = await getQueueState(organizationId, req.user.id);
    res.json(state);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const joinQueue = async (req, res) => {
  const { organizationId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(organizationId)) {
    return res.status(400).json({ message: "Invalid organizationId" });
  }

  try {
    const organization = await getOrganizationById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    if (organization.queueStatus !== "active") {
      return res.status(400).json({
        message:
          organization.queueStatus === "paused"
            ? "Queue is paused right now"
            : "Queue is closed right now"
      });
    }

    const existingEntry = await getActiveQueueForUser(req.user.id, organizationId);
    if (existingEntry) {
      const state = await getQueueState(organizationId, req.user.id);
      return res.json({ message: "Already in queue", state });
    }

    const activeCount = await Queue.countDocuments({
      organizationId,
      status: { $in: ACTIVE_STATUSES }
    });

    const queueLimit = organization.maxQueueLimit ?? organization.queueLimit;
    if (activeCount >= queueLimit) {
      return res.status(400).json({ message: "Queue is full for this organization" });
    }

    const counter = await Counter.findOneAndUpdate(
      { organizationId },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await Queue.create({
      userId: req.user.id,
      organizationId,
      tokenNumber: counter.seq,
      status: "waiting",
      swapCount: 0
    });

    await createNotification({
      userId: req.user.id,
      organizationId,
      type: "success",
      title: "You joined the queue",
      message: `You joined ${organization.name} with token #${counter.seq}.`
    });

    await broadcastOrganization(organizationId, "queue-state", () =>
      getQueueState(organizationId)
    );

    res.status(201).json({
      message: `Joined ${organization.name} with token #${counter.seq}`,
      state: await getQueueState(organizationId, req.user.id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const leaveQueue = async (req, res) => {
  try {
    const { organizationId } = req.body;
    const entry = await getActiveQueueForUser(req.user.id, organizationId);

    if (!entry) {
      return res.status(404).json({ message: "Active queue entry not found" });
    }

    entry.status = "completed";
    await entry.save();

    await SwapRequest.updateMany(
      {
        organizationId,
        status: "open",
        $or: [
          { requesterUserId: req.user.id },
          { "responses.responderUserId": req.user.id }
        ]
      },
      { $set: { status: "cancelled" } }
    );

    await broadcastOrganization(organizationId, "queue-state", () =>
      getQueueState(organizationId)
    );

    res.json({ message: "Left queue successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSwapRequest = async (req, res) => {
  try {
    const { organizationId, message = "" } = req.body;
    const organization = await getOrganizationById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    if (!organization.swapEnabled) {
      return res.status(400).json({ message: "Swap is disabled for this organization" });
    }

    const requesterEntry = await getActiveQueueForUser(req.user.id, organizationId);
    if (requesterEntry) {
      requesterEntry.organizationConfig = organization;
    }

    validateSwapEligibility(requesterEntry, "Requester");

    const existingOpenRequest = await getOpenSwapForRequester(req.user.id, organizationId);
    if (existingOpenRequest) {
      return res.status(400).json({ message: "You already have an open swap request" });
    }

    await SwapRequest.create({
      requesterUserId: req.user.id,
      requesterQueueId: requesterEntry._id,
      organizationId,
      requesterToken: requesterEntry.tokenNumber,
      message
    });

    await broadcastOrganization(organizationId, "queue-state", () =>
      getQueueState(organizationId)
    );

    res.status(201).json({
      message: "Swap request sent to the whole organization queue",
      state: await getQueueState(organizationId, req.user.id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const respondToSwapRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { decision } = req.body;

    if (!["accepted", "declined"].includes(decision)) {
      return res.status(400).json({ message: "Decision must be accepted or declined" });
    }

    const request = await SwapRequest.findById(requestId);
    if (!request || request.status !== "open") {
      return res.status(404).json({ message: "Swap request not found" });
    }

    if (String(request.requesterUserId) === String(req.user.id)) {
      return res.status(400).json({ message: "Requester cannot respond to their own swap" });
    }

    const responderEntry = await getActiveQueueForUser(
      req.user.id,
      request.organizationId
    );
    const organization = await getOrganizationById(request.organizationId);
    if (responderEntry) {
      responderEntry.organizationConfig = organization;
    }

    validateSwapEligibility(responderEntry, "Responder");

    const positionDiff = Math.abs(request.requesterToken - responderEntry.tokenNumber);
    if (positionDiff > 2) {
      return res.status(400).json({ message: "Swap allowed only within +/-2 positions" });
    }

    const existingResponseIndex = request.responses.findIndex(
      (response) => String(response.responderUserId) === String(req.user.id)
    );

    const nextResponse = {
      responderUserId: req.user.id,
      responderQueueId: responderEntry._id,
      responderToken: responderEntry.tokenNumber,
      status: decision,
      respondedAt: new Date()
    };

    if (existingResponseIndex >= 0) {
      request.responses[existingResponseIndex] = nextResponse;
    } else {
      request.responses.push(nextResponse);
    }

    await request.save();

    await broadcastOrganization(request.organizationId, "queue-state", () =>
      getQueueState(request.organizationId)
    );

    res.json({
      message:
        decision === "accepted"
          ? "Swap acceptance recorded. The requester can now choose."
          : "Swap request declined",
      state: await getQueueState(request.organizationId, req.user.id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const finalizeSwapRequest = async (req, res) => {
  const { requestId } = req.params;
  const { responderUserId } = req.body;

  try {
    const request = await SwapRequest.findById(requestId);
    if (!request || request.status !== "open") {
      return res.status(404).json({ message: "Swap request not found" });
    }

    if (String(request.requesterUserId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Only the requester can finalize this swap" });
    }

    const selectedResponse = request.responses.find(
      (response) =>
        String(response.responderUserId) === String(responderUserId) &&
        response.status === "accepted"
    );

    if (!selectedResponse) {
      return res.status(400).json({ message: "Selected responder has not accepted" });
    }

    const requesterEntry = await Queue.findById(request.requesterQueueId);
    const responderEntry = await Queue.findById(selectedResponse.responderQueueId);
    const organization = await getOrganizationById(request.organizationId);

    if (!organization?.swapEnabled) {
      return res.status(400).json({ message: "Swap is disabled for this organization" });
    }

    if (requesterEntry) {
      requesterEntry.organizationConfig = organization;
    }

    if (responderEntry) {
      responderEntry.organizationConfig = organization;
    }

    validateSwapEligibility(requesterEntry, "Requester");
    validateSwapEligibility(responderEntry, "Responder");

    const positionDiff = Math.abs(requesterEntry.tokenNumber - responderEntry.tokenNumber);
    if (positionDiff > 2) {
      return res.status(400).json({ message: "Swap allowed only within +/-2 positions" });
    }

    const requesterToken = requesterEntry.tokenNumber;
    const responderToken = responderEntry.tokenNumber;
    const temporaryToken = -Math.floor(Date.now() / 1000);

    requesterEntry.tokenNumber = temporaryToken;
    await requesterEntry.save();

    responderEntry.tokenNumber = requesterToken;
    await responderEntry.save();

    requesterEntry.tokenNumber = responderToken;
    requesterEntry.swapCount += 1;
    responderEntry.swapCount += 1;

    request.status = "completed";
    request.selectedResponderUserId = responderUserId;

    await requesterEntry.save();
    await responderEntry.save();
    await request.save();
    await Promise.all([
      createNotification({
        userId: requesterEntry.userId,
        organizationId: request.organizationId,
        type: "success",
        title: "Swap successful",
        message: `Your token was updated to #${requesterEntry.tokenNumber}.`
      }),
      createNotification({
        userId: responderEntry.userId,
        organizationId: request.organizationId,
        type: "success",
        title: "Swap successful",
        message: `Your token was updated to #${responderEntry.tokenNumber}.`
      })
    ]);

    await broadcastOrganization(request.organizationId, "queue-state", () =>
      getQueueState(request.organizationId)
    );

    res.json({
      message: "Tokens swapped successfully",
      state: await getQueueState(request.organizationId, req.user.id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
