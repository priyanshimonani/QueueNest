import Office from "../models/Office.js";
import Queue from "../models/Queue.js";
import { broadcastQueueState } from "./queueController.js";

const ACTIVE_QUEUE_STATUSES = ["waiting", "serving"];

const getOrganizationForAdmin = async (adminId, organizationId) => {
  const office = organizationId
    ? await Office.findOne({ _id: organizationId, createdBy: adminId })
    : await Office.findOne({ createdBy: adminId });

  if (!office) {
    throw new Error("Organization not found for this admin");
  }

  return office;
};

const buildDashboardPayload = async (office) => {
  const queueEntries = await Queue.find({
    organizationId: office._id,
    status: { $in: ACTIVE_QUEUE_STATUSES }
  })
    .populate("userId", "name")
    .sort({ tokenNumber: 1 })
    .lean();

  const upcoming = queueEntries
    .filter((entry) => entry.status === "waiting")
    .slice(0, 3)
    .map((entry) => `#${entry.tokenNumber}`);

  return {
    office: {
      _id: office._id,
      organizationId: office.organizationId ?? String(office._id),
      name: office.name,
      category: office.category,
      location: office.location,
      avgServiceTime: office.avgServiceTime ?? office.avgWaitingTime,
      maxQueueLimit: office.maxQueueLimit ?? office.queueLimit,
      swapEnabled: office.swapEnabled,
      maxSwapsPerUser: office.maxSwapsPerUser,
      queueStatus: office.queueStatus,
      currentToken: office.currentToken
    },
    activeQueues: 1,
    totalWaiting: queueEntries.length,
    avgServiceTime: office.avgServiceTime ?? office.avgWaitingTime,
    currentToken: office.currentToken,
    upcoming,
    users: queueEntries.map((entry) => ({
      id: entry._id,
      name: entry.userId?.name ?? "Unknown User",
      tokenNumber: entry.tokenNumber,
      status: entry.status
    }))
  };
};

export const createOrganization = async (req, res) => {
  try {
    const adminId = req.user.id;
    const {
      organizationName,
      category,
      location,
      avgServiceTime,
      maxQueueLimit,
      swapEnabled = true,
      maxSwapsPerUser = 2
    } = req.body;

    const existingOrganization = await Office.findOne({ createdBy: adminId });
    if (existingOrganization) {
      return res.status(400).json({
        message: "This admin can create only one organization"
      });
    }

    const office = await Office.create({
      admin: adminId,
      createdBy: adminId,
      name: organizationName,
      category,
      location,
      avgServiceTime,
      avgWaitingTime: avgServiceTime,
      maxQueueLimit,
      queueLimit: maxQueueLimit,
      swapEnabled,
      maxSwapsPerUser,
      queueStatus: "active",
      operatingHours: "9:00 AM - 5:00 PM",
      counters: 1
    });

    office.organizationId = String(office._id);
    await office.save();

    res.status(201).json({
      message: "Organization created",
      office
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminOrganizations = async (req, res) => {
  try {
    const organizations = await Office.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(
      organizations.map((office) => ({
        _id: office._id,
        organizationId: office.organizationId ?? String(office._id),
        name: office.name,
        category: office.category,
        location: office.location,
        avgServiceTime: office.avgServiceTime ?? office.avgWaitingTime,
        maxQueueLimit: office.maxQueueLimit ?? office.queueLimit,
        swapEnabled: office.swapEnabled,
        maxSwapsPerUser: office.maxSwapsPerUser,
        queueStatus: office.queueStatus,
        currentToken: office.currentToken
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const office = await getOrganizationForAdmin(
      req.user.id,
      req.query.organizationId
    );

    res.json(await buildDashboardPayload(office));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const callNext = async (req, res) => {
  try {
    const office = await getOrganizationForAdmin(
      req.user.id,
      req.body.organizationId
    );

    const currentServing = await Queue.findOne({
      organizationId: office._id,
      status: "serving"
    });

    if (currentServing) {
      currentServing.status = "completed";
      await currentServing.save();
    }

    const next = await Queue.findOne({
      organizationId: office._id,
      status: "waiting"
    }).sort({ tokenNumber: 1 });

    if (!next) {
      return res.json({ message: "No one in queue" });
    }

    next.status = "serving";
    await next.save();

    office.currentToken = next.tokenNumber;
    await office.save();
    await broadcastQueueState(office._id);

    res.json({
      message: "Next token called",
      token: next,
      dashboard: await buildDashboardPayload(office)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateQueueStatus = async (req, res) => {
  try {
    const { organizationId, queueStatus } = req.body;
    const allowedStatuses = ["active", "paused", "closed"];

    if (!allowedStatuses.includes(queueStatus)) {
      return res.status(400).json({ message: "Invalid queueStatus" });
    }

    const office = await getOrganizationForAdmin(req.user.id, organizationId);
    office.queueStatus = queueStatus;
    office.isPaused = queueStatus === "paused";
    await office.save();
    await broadcastQueueState(office._id);

    res.json({
      message: `Queue ${queueStatus}`,
      office
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const {
      organizationId,
      maxQueueLimit,
      avgServiceTime,
      swapEnabled,
      maxSwapsPerUser
    } = req.body;

    const office = await getOrganizationForAdmin(req.user.id, organizationId);

    if (maxQueueLimit !== undefined) {
      office.maxQueueLimit = maxQueueLimit;
      office.queueLimit = maxQueueLimit;
    }

    if (avgServiceTime !== undefined) {
      office.avgServiceTime = avgServiceTime;
      office.avgWaitingTime = avgServiceTime;
    }

    if (swapEnabled !== undefined) {
      office.swapEnabled = swapEnabled;
    }

    if (maxSwapsPerUser !== undefined) {
      office.maxSwapsPerUser = maxSwapsPerUser;
    }

    await office.save();
    await broadcastQueueState(office._id);

    res.json({
      message: "Settings updated",
      office
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
