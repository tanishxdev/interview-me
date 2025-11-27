import {
  createSessionService,
  joinSessionService,
  endSessionService,
  getActiveSessionsService,
  getMyRecentSessionsService,
  getSessionByIdService,
} from "../services/session.service.js";

/**
 * CREATE SESSION CONTROLLER
 */
export async function createSession(req, res, next) {
  try {
    const session = await createSessionService(req.user, req.body);

    res.status(201).json({
      status: "success",
      data: { session },
    });

  } catch (error) {
    next(error);
  }
}

/**
 * GET ACTIVE SESSIONS CONTROLLER
 */
export async function getActiveSessions(req, res, next) {
  try {
    const sessions = await getActiveSessionsService();

    res.status(200).json({
      status: "success",
      data: { sessions },
    });

  } catch (error) {
    next(error);
  }
}

/**
 * GET USER RECENT SESSIONS CONTROLLER
 */
export async function getMyRecentSessions(req, res, next) {
  try {
    const sessions = await getMyRecentSessionsService(req.user._id);

    res.status(200).json({
      status: "success",
      data: { sessions },
    });

  } catch (error) {
    next(error);
  }
}

/**
 * GET SESSION BY ID CONTROLLER
 */
export async function getSessionById(req, res, next) {
  try {
    const session = await getSessionByIdService(req.params.id);

    res.status(200).json({
      status: "success",
      data: { session },
    });

  } catch (error) {
    next(error);
  }
}

/**
 * JOIN SESSION CONTROLLER
 */
export async function joinSession(req, res, next) {
  try {
    const session = await joinSessionService(req.params.id, req.user);

    res.status(200).json({
      status: "success",
      data: { session },
    });

  } catch (error) {
    next(error);
  }
}

/**
 * END SESSION CONTROLLER (HOST ONLY)
 */
export async function endSession(req, res, next) {
  try {
    const session = await endSessionService(req.params.id, req.user);

    res.status(200).json({
      status: "success",
      data: { session },
    });

  } catch (error) {
    next(error);
  }
}
