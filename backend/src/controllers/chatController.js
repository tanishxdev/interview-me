import { generateStreamToken } from "../services/chat.service.js";

/**
 * GET STREAM TOKEN CONTROLLER
 * Generates a Stream Chat token for authenticated user
 */
export async function getStreamToken(req, res, next) {
  try {
    // Safety guard: user must exist from protectRoute
    if (!req.user) {
      throw new Error("User context missing in request");
    }

    const tokenData = await generateStreamToken(req.user);

    res.status(200).json({
      status: "success",
      data: tokenData,
    });

  } catch (error) {
    next(error);
  }
}
