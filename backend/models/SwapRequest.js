import mongoose from "mongoose";

const swapResponseSchema = new mongoose.Schema(
  {
    responderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    responderQueueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Queue",
      required: true
    },
    responderToken: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["accepted", "declined"],
      required: true
    },
    respondedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const swapRequestSchema = new mongoose.Schema(
  {
    requesterUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    requesterQueueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Queue",
      required: true
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Office",
      required: true
    },
    requesterToken: {
      type: Number,
      required: true
    },
    message: {
      type: String,
      trim: true,
      maxlength: 240,
      default: ""
    },
    status: {
      type: String,
      enum: ["open", "completed", "cancelled"],
      default: "open"
    },
    selectedResponderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    responses: {
      type: [swapResponseSchema],
      default: []
    }
  },
  { timestamps: true }
);

swapRequestSchema.index({ organizationId: 1, status: 1, createdAt: -1 });

export default mongoose.model("SwapRequest", swapRequestSchema);
