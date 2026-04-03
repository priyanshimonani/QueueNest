import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Office",
      required: true,
      unique: true
    },
    seq: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Counter", counterSchema);
