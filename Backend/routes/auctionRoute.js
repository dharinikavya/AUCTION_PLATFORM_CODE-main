import express from "express";
import {
  addNewAuctionItem,
  getAllAuctionItem,
  getAuctionDetails,
  getMyAuctionItem,
  removeFromAuction,
  republishItem,
  finalizeAuction
} from "../controllers/auctionItemControler.js";
import { isAuthenticated, isAuthorized } from "../midellware/auth.js";
import { trackCommissionStatus } from "../midellware/trackCommissionStatus.js";

const route = express.Router();

// CREATE AUCTION — Only Auctioner or Super Admin
route.post(
  "/create",
  isAuthenticated,
  isAuthorized("Auctioner", "Super Admin"),
  trackCommissionStatus,
  addNewAuctionItem
);

// GET ALL AUCTIONS — Public
route.get("/allitems", getAllAuctionItem);

// GET AUCTION DETAILS — Logged in users
route.get("/auction/:id", isAuthenticated, getAuctionDetails);

// GET MY AUCTIONS — Only Auctioner or Super Admin
route.get(
  "/myitems",
  isAuthenticated,
  isAuthorized("Auctioner", "Super Admin"),
  getMyAuctionItem
);

// DELETE ENDED AUCTION — Only creator or Super Admin
route.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Auctioner", "Super Admin"),
  removeFromAuction
);

// REPUBLISH AUCTION — Only Auctioner or Super Admin
route.put(
  "/item/republish/:id",
  isAuthenticated,
  isAuthorized("Auctioner", "Super Admin"),
  republishItem
);

// FINALIZE AUCTIONS MANUALLY — Super Admin only
route.put(
  "/finalize",
  isAuthenticated,
  isAuthorized("Super Admin"),
  finalizeAuction
);

export default route;
