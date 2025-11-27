import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { validate } from "../middleware/validate.js";
import {
  createSessionSchema,
  sessionIdSchema,
} from "../validators/session.schema.js";

import {
  createSession,
  endSession,
  getActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSession,
} from "../controllers/sessionController.js";

/**
 * Sessions Routes
 * Handles interview session workflow
 */
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Interview session management APIs
 */

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Create a new interview session
 *     tags: [Sessions]
 *     security:
 *       - ClerkAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - problem
 *               - difficulty
 *             properties:
 *               problem:
 *                 type: string
 *                 example: Binary Search Tree Optimization
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *     responses:
 *       201:
 *         description: Session created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 */

/**
 * POST /sessions
 * Create a new interview session
 */
router.post("/", protectRoute, validate(createSessionSchema), createSession);

/**
 * @swagger
 * /sessions/active:
 *   get:
 *     summary: Get all active sessions
 *     tags: [Sessions]
 *     security:
 *       - ClerkAuth: []
 *     responses:
 *       200:
 *         description: List of active sessions
 */

/**
 * GET /sessions/active
 * Get all currently active sessions
 */
router.get("/active", protectRoute, getActiveSessions);

/**
 * @swagger
 * /sessions/my-recent:
 *   get:
 *     summary: Get user's completed sessions
 *     tags: [Sessions]
 *     security:
 *       - ClerkAuth: []
 *     responses:
 *       200:
 *         description: Recent session history
 */

/**
 * GET /sessions/my-recent
 * Get recently completed sessions of user
 */
router.get("/my-recent", protectRoute, getMyRecentSessions);

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Get session by ID
 *     tags: [Sessions]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session details returned
 *       404:
 *         description: Session not found
 */

/**
 * GET /sessions/:id
 * Fetch session by ID
 */
router.get("/:id", protectRoute, getSessionById);

/**
 * @swagger
 * /sessions/{id}/join:
 *   post:
 *     summary: Join an active session
 *     tags: [Sessions]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully joined session
 *       409:
 *         description: Session already full
 */

/**
 * POST /sessions/:id/join
 * Join an active session
 */
router.post("/:id/join", protectRoute, joinSession);

/**
 * @swagger
 * /sessions/{id}/end:
 *   post:
 *     summary: End a session (host only)
 *     tags: [Sessions]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session ended successfully
 *       403:
 *         description: Only host can end session
 */

/**
 * POST /sessions/:id/end
 * End session (host-only)
 */
router.post("/:id/end", protectRoute, endSession);

export default router;
