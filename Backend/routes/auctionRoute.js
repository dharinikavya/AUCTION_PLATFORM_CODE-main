import express from "express";
import {
  addNewAuctionItem,
  getAllAuctionItem,
  getAuctionDetails,
  getMyAuctionItem,
  removeFromAuction,
  republishItem
} from "../controllers/auctionItemControler.js";
import { isAuthenticated, isAuthorized } from "../midellware/auth.js";
import { trackCommissionStatus } from "../midellware/trackCommissionStatus.js";

const route = express.Router();

// CREATE AUCTION ITEM — Only Auctioner or Super Admin
route.post(
  "/create",
  isAuthenticated,
  isAuthorized("Auctioner", "Super Admin"),
  trackCommissionStatus,
  addNewAuctionItem
);

// PUBLIC — All items
route.get("/allitems", getAllAuctionItem);

// GET DETAILS — User must be logged in
route.get("/auction/:id", isAuthenticated, getAuctionDetails);

// MY ITEMS — Only Auctioner or Super Admin
route.get(
  "/myitems",
  isAuthenticated,
  isAuthorized("Auctioner", "Super Admin"),
  getMyAuctionItem
);

// DELETE ITEM — Only Auctioner or Super Admin
route.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Auctioner", "Super Admin"),
  removeFromAuction
);

// REPUBLISH — Only Auctioner or Super Admin
route.put(
  "/item/republish/:id",
  isAuthenticated,
  isAuthorized("Auctioner", "Super Admin"),
  republishItem
);

export default route;
