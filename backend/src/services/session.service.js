import Session from "../models/Session.js";
import { chatClient, streamClient } from "../lib/stream.js";
import { AppError } from "../utils/AppError.js";
import { logger } from "../lib/logger.js";

/* ======================================
   CREATE SESSION
   Creates DB session + Stream video call + Chat channel
====================================== */
export async function createSessionService(user, data) {
  const { problem, difficulty } = data;

  if (!problem || !difficulty) {
    throw new AppError("Problem and difficulty required", 400);
  }

  // Prevent multiple active sessions per host
  const existing = await Session.findOne({
    host: user._id,
    status: "active",
  });

  if (existing) {
    throw new AppError("You already have an active session", 409);
  }

  // Unique call identifier
  const callId = `session_${Date.now()}_${Math.random()
    .toString(36)
    .substring(7)}`;

  let session;

  try {
    session = await Session.create({
      problem,
      difficulty,
      host: user._id,
      callId,
    });

    // Create Stream Video Call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: user.clerkId,
        custom: {
          problem,
          difficulty,
          sessionId: session._id.toString(),
        },
      },
    });

    // Create Stream Chat Channel
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: user.clerkId,
      members: [user.clerkId],
    });

    await channel.create();

    return session;

  } catch (error) {

    logger.error(
      { error: error.message },
      "Session creation failed"
    );

    // Rollback DB session if Stream failed
    if (session?._id) {
      await Session.findByIdAndDelete(session._id);
    }

    throw new AppError("Failed to create session", 500);
  }
}

/* ======================================
   GET ACTIVE SESSIONS
====================================== */
export async function getActiveSessionsService() {
  return Session.find({ status: "active" })
    .populate("host", "name profileImage email clerkId")
    .populate("participant", "name profileImage email clerkId")
    .sort({ createdAt: -1 })
    .limit(20);
}

/* ======================================
   USER RECENT SESSIONS
====================================== */
export async function getMyRecentSessionsService(userId) {
  return Session.find({
    status: "completed",
    $or: [{ host: userId }, { participant: userId }],
  })
    .sort({ createdAt: -1 })
    .limit(20);
}

/* ======================================
   GET SESSION BY ID
====================================== */
export async function getSessionByIdService(id) {
  const session = await Session.findById(id)
    .populate("host", "name email profileImage clerkId")
    .populate("participant", "name email profileImage clerkId");

  if (!session) throw new AppError("Session not found", 404);

  return session;
}

/* ======================================
   JOIN SESSION
====================================== */
export async function joinSessionService(sessionId, user) {
  const session = await Session.findById(sessionId);

  if (!session) throw new AppError("Session not found", 404);
  if (session.status !== "active")
    throw new AppError("Session not active", 400);
  if (session.host.toString() === user._id.toString())
    throw new AppError("Host cannot join own session", 400);
  if (session.participant)
    throw new AppError("Session already full", 409);

  // Assign participant
  session.participant = user._id;
  session.startedAt = new Date();

  await session.save();

  // Add member to Stream chat
  const channel = chatClient.channel("messaging", session.callId);
  await channel.addMembers([user.clerkId]);

  return session;
}

/* ======================================
   END SESSION
====================================== */
export async function endSessionService(sessionId, user) {
  const session = await Session.findById(sessionId);

  if (!session) throw new AppError("Session not found", 404);
  if (session.host.toString() !== user._id.toString())
    throw new AppError("Only host can end session", 403);
  if (session.status === "completed")
    throw new AppError("Session already completed", 400);

  try {
    // End Stream video call
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    // Delete Stream chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    session.status = "completed";
    session.endedAt = new Date();

    await session.save();

    return session;

  } catch (error) {
    logger.error(
      { error: error.message },
      "Failed to properly end session"
    );

    throw new AppError("Failed to end session", 500);
  }
}
