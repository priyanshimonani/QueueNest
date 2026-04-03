import express from "express";
import {
  createOrganization,
  getAdminOrganizations,
  getDashboard,
  callNext,
  updateQueueStatus,
  updateSettings
} from "../controllers/adminController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/organizations", protect, adminOnly, createOrganization);
router.get("/organizations", protect, adminOnly, getAdminOrganizations);
router.get("/dashboard", protect, adminOnly, getDashboard);
router.post("/call-next", protect, adminOnly, callNext);
router.post("/status", protect, adminOnly, updateQueueStatus);
router.put("/settings", protect, adminOnly, updateSettings);

export default router;
