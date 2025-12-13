import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";

const AuctionCard = ({ auction, token, onDelete }) => {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this auction?")) return;

    try {
      const res = await fetch(`https://your-backend.com/api/auctions/delete/${auction._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        alert("Auction deleted successfully");
        onDelete(auction._id);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete auction");
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{auction.title}</CardTitle>
        <CardDescription>Status: {auction.status}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{auction.description}</p>
        <p>Starting Bid: ₹{auction.startingBid}</p>
        <p>Current Bid: ₹{auction.currentBid}</p>
      </CardContent>
      <CardFooter>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
      </CardFooter>
    </Card>
  );
};

export default AuctionCard;
