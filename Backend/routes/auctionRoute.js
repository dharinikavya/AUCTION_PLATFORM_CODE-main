import express from "express";
import { 
  addNewAuctionItem, 
  getAllAuctionItem, 
  getAuctionDetails, 
  getMyAuctionItem, 
  removeFromAuction, 
  republishItem 
} from "../constrollers/auctionItemControler.js";

const route = express.Router();

// ⛔ AUTH REMOVED (TEMPORARY)
// ⛔ ROLE CHECK REMOVED
// ⛔ Commission check removed only for create route if needed

route.post("/create", addNewAuctionItem);

route.get("/allitems", getAllAuctionItem);

route.get("/auction/:id", getAuctionDetails);

route.get("/myitems", getMyAuctionItem);

route.delete("/delete/:id", removeFromAuction);

route.put("/item/republish/:id", republishItem);

export default route;
