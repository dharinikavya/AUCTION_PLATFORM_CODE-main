import express from "express";
import {
  addNewAuctionItem,
  getAllAuctionItem,
  getAuctionDetails,
  getMyAuctionItem,
  removeFromAuction,
  republishItem,
  finalizeAuction
} from "../controllers/auctionItemController.js";
import { isAuthenticated, isAuthorized } from "../midellware/auth.js";
import { trackCommissionStatus } from "../midellware/trackCommissionStatus.js";

const route = express.Router();

// CREATE AUCTION
route.post(
  "/create",
  isAuthenticated,
  isAuthorized("Auctioner", "Super Admin"),
  trackCommissionStatus,
  addNewAuctionItem
);

// GET ALL AUCTIONS
route.get("/allitems", getAllAuctionItem);

// GET AUCTION DETAILS
route.get("/auction/:id", isAuthenticated, getAuctionDetails);

// GET MY AUCTIONS
route.get(
  "/myitems",
  isAuthenticated,
  isAuthorized("Auctioner", "Super Admin"),
  getMyAuctionItem
);

// DELETE ENDED AUCTION
route.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Auctioner", "Super Admin"),
  removeFromAuction
);

// REPUBLISH AUCTION
route.put(
  "/item/republish/:id",
  isAuthenticated,
  isAuthorized("Auctioner", "Super Admin"),
  republishItem
);

// FINALIZE AUCTIONS MANUALLY
route.put("/finalize", isAuthenticated, isAuthorized("Super Admin"), finalizeAuction);

export default route;
