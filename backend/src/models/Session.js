import mongoose from "mongoose";

/**
 * Session Schema
 * Represents an interview session between two users
 */
const sessionSchema = new mongoose.Schema(
  {
    // Interview problem statement
    problem: {
      type: String,
      required: true,
      trim: true,
    },

    // Difficulty level of interview
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    // User who created the session
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // User who joined the session
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // Session lifecycle status
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
      index: true,
    },

    // Stream/Video call identifier (assigned later)
    callId: {
      type: String,
      default: null,
    },

    // Timestamp when session started
    startedAt: {
      type: Date,
    },

    // Timestamp when session ended
    endedAt: {
      type: Date,
    },

    // Session duration in minutes (auto-calculated)
    duration: {
      type: Number,
    },

    // Feedback from participant
    feedback: {
      type: String,
      default: "",
    },

    // Rating from 1 to 5
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    // User who cancelled the session (if cancelled)
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * Pre-save hook to calculate duration automatically
 */
sessionSchema.pre("save", function (next) {
  if (this.startedAt && this.endedAt) {
    const diff = Math.abs(this.endedAt - this.startedAt);
    this.duration = Math.ceil(diff / (1000 * 60)); // minutes
  }
  next();
});

export default mongoose.model("Session", sessionSchema);
