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
router.get("/leaderboard", fetchLeaderboard); 
// 🔥 leaderboard should be PUBLIC (no auth)

/* ================= NOTIFICATIONS ================= */
router.get("/notifications", isAuthenticated, getNotifications);
router.put("/notifications/read", isAuthenticated, markNotificationsRead);

export default router;
