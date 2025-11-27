import { Inngest } from "inngest";
import { connectDB } from "../lib/db.js";
import User from "../models/User.js";
import { deleteStreamUser, upsertStreamUser } from "../lib/stream.js";
import { logger } from "../lib/logger.js";

export const inngest = new Inngest({
  id: "interview-me-backend",
});

/* =========================================
   USER CREATED EVENT HANDLER
   Trigger: clerk/user.created
========================================= */
export const syncUser = inngest.createFunction(
  { id: "sync-user-v1" },
  { event: "clerk/user.created" },

  async ({ event }) => {
    try {
      // Ensure database is connected
      await connectDB();

      const { id, email_addresses, first_name, last_name, image_url } =
        event.data;

      // Safety check: avoid invalid webhook payload
      if (!id) {
        logger.warn("Clerk event received without user id", { event });
        return;
      }

      // Prevent duplicate user creation
      const existing = await User.findOne({ clerkId: id });
      if (existing) {
        logger.info("User already exists", { clerkId: id });
        return;
      }

      const email = email_addresses?.[0]?.email_address || null;

      const newUser = {
        clerkId: id,
        email,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        profileImage: image_url || null,
      };

      const user = await User.create(newUser);

      const streamResult = await upsertStreamUser({
        id: user.clerkId,
        name: user.name,
        image: user.profileImage,
      });

      if (!streamResult) {
        logger.error("Stream sync failed after DB creation", {
          clerkId: user.clerkId,
        });
      }

      logger.info("User synced successfully", {
        clerkId: user.clerkId,
        email: user.email,
        eventId: event.id,
      });
    } catch (error) {
      logger.error(
        {
          error: error.message,
          stack: error.stack,
          eventId: event.id,
        },
        "Failed to sync user"
      );

      // Allow Inngest to retry this job
      throw error;
    }
  }
);

/* =========================================
   USER DELETED EVENT HANDLER
   Trigger: clerk/user.deleted
========================================= */
export const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-v1" },
  { event: "clerk/user.deleted" },

  async ({ event }) => {
    try {
      await connectDB();

      const { id } = event.data;

      if (!id) {
        logger.warn("Delete event missing user id", { event });
        return;
      }

      await User.deleteOne({ clerkId: id });

      const streamDeleted = await deleteStreamUser(id);

      if (!streamDeleted) {
        logger.error("Stream delete failed", { clerkId: id });
      }

      logger.info("User deleted successfully", {
        clerkId: id,
        eventId: event.id,
      });
    } catch (error) {
      logger.error(
        {
          error: error.message,
          stack: error.stack,
          eventId: event.id,
        },
        "Failed to delete user"
      );

      throw error;
    }
  }
);

export const functions = [syncUser, deleteUserFromDB];
