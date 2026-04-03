import mongoose from "mongoose";

const officeSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      unique: true,
      required: true
    },
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      trim: true
    },
    location: { type: String, required: true },
    operatingHours: { type: String, default: "9:00 AM - 5:00 PM" },
    counters: { type: Number, default: 1 },
    queueLimit: { type: Number, default: 50 },
    maxQueueLimit: { type: Number, default: 50 },
    avgWaitingTime: { type: Number, default: 5 },
    avgServiceTime: { type: Number, default: 5 },
    swapEnabled: { type: Boolean, default: true },
    maxSwapsPerUser: { type: Number, default: 2 },
    queueStatus: {
      type: String,
      enum: ["active", "paused", "closed"],
      default: "active"
    },
    organizationId: {
      type: String,
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    },
    currentToken: { type: Number, default: 0 },
    isPaused: { type: Boolean, default: false }
  },
  { timestamps: true }
);

officeSchema.pre("validate", function syncAdminFields() {
  if (!this.createdBy) {
    this.createdBy = this.admin;
  }

  if (!this.organizationId) {
    this.organizationId = this._id?.toString?.() ?? null;
  }

  if (this.maxQueueLimit == null) {
    this.maxQueueLimit = this.queueLimit ?? 50;
  }

  if (this.queueLimit == null) {
    this.queueLimit = this.maxQueueLimit ?? 50;
  }

  if (this.avgServiceTime == null) {
    this.avgServiceTime = this.avgWaitingTime ?? 5;
  }

  if (this.avgWaitingTime == null) {
    this.avgWaitingTime = this.avgServiceTime ?? 5;
  }

  this.isPaused = this.queueStatus === "paused";
});

export default mongoose.model("Office", officeSchema);
