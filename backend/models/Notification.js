import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Office",
      default: null
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "alert"],
      default: "info"
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
