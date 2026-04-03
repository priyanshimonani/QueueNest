import mongoose from "mongoose";

const queueSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Office",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    tokenNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ["waiting", "serving", "completed"],
      default: "waiting"
    },
    swapCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

queueSchema.index(
  { organizationId: 1, tokenNumber: 1 },
  { unique: true }
);

queueSchema.index(
  { organizationId: 1, userId: 1, status: 1 },
  { partialFilterExpression: { status: { $in: ["waiting", "serving"] } } }
);

export default mongoose.model("Queue", queueSchema);
