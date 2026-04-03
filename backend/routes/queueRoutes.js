import express from "express";
import {
  createSwapRequest,
  demoLogin,
  finalizeSwapRequest,
  getMyProfile,
  getNotifications,
  getOrganizations,
  getOrganizationState,
  joinQueue,
  leaveQueue,
  respondToSwapRequest,
  streamQueueUpdates
} from "../controllers/queueController.js";
import { protect, protectStream } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/demo-login", demoLogin);
router.get("/organizations", getOrganizations);
router.get("/me", protect, getMyProfile);
router.get("/notifications", protect, getNotifications);
router.get("/state", protect, getOrganizationState);
router.post("/join", protect, joinQueue);
router.post("/leave", protect, leaveQueue);
router.post("/swap-requests", protect, createSwapRequest);
router.post("/swap-requests/:requestId/respond", protect, respondToSwapRequest);
router.post("/swap-requests/:requestId/finalize", protect, finalizeSwapRequest);
router.get("/stream", protectStream, streamQueueUpdates);

export default router;
