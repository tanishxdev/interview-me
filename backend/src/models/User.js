import mongoose from "mongoose";

/**
 * User Schema
 * Represents a platform user synced via Clerk
 */
const userSchema = new mongoose.Schema(
  {
    // Full Name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // User email address
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    // Profile image URL
    profileImage: {
      type: String,
      default: "",
    },

    // Clerk identifier
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Role based permission
    role: {
      type: String,
      enum: ["candidate", "interviewer", "admin"],
      default: "candidate",
    },

    // Short bio for user profile
    bio: {
      type: String,
      maxlength: 300,
      default: "",
    },

    // Soft account status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Last login timestamp
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
