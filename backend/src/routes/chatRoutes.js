import express from "express";
import { getStreamToken } from "../controllers/chatController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Stream chat related endpoints
 */

/**
 * @swagger
 * /chat/token:
 *   get:
 *     summary: Generate Stream token for authenticated user
 *     description: Returns a Stream Chat token for real-time messaging usage.
 *     tags: [Chat]
 *     security:
 *       - ClerkAuth: []
 *     responses:
 *       200:
 *         description: Stream token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 userId:
 *                   type: string
 *                   example: user_12345
 *                 userName:
 *                   type: string
 *                   example: Tanish Kumar
 *                 userImage:
 *                   type: string
 *                   example: https://example.com/profile.png
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Internal server error
 */
router.get("/token", protectRoute, getStreamToken);

export default router;
