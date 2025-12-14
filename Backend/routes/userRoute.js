import express from "express";
import {
  register,
  login,
  logout,
  getUserProfile,
  fetchLeaderboard,
  getNotifications,
  markNotificationsRead,
} from "../controllers/userControler.js";
import { isAuthenticated } from "../midellware/auth.js";

const router = express.Router();

/* ================= AUTH ================= */
router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);

/* ================= USER ================= */
router.get("/me", isAuthenticated, getUserProfile);

/* ================= LEADERBOARD ================= */
/**
 * ✅ PUBLIC
 * Reason:
 * - Leaderboard is shown before login
 * - Used on homepage & leaderboard page
 */
router.get("/leaderboard", fetchLeaderboard);

/* ================= 🔔 NOTIFICATIONS ================= */
/**
 * ✅ PRIVATE
 * - Uses httpOnly cookie
 * - Required for toast, sound, notification page
 */
router.get("/notifications", isAuthenticated, getNotifications);

/**
 * ✅ MARK AS READ
 * - Called when user clicks notification
 */
router.put("/notifications/read", isAuthenticated, markNotificationsRead);

export default router;
