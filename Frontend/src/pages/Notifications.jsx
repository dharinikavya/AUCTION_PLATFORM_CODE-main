import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markReadNotifications } from "@/store/slice/userSlice";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notifications, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, []);

  const handleClick = async (notification) => {
    // 1️⃣ Mark all as read (simple & safe)
    dispatch(markReadNotifications());

    // 2️⃣ Navigate to auction details
    if (notification.auction) {
      navigate(`/auction/details/${notification.auction}`);
    }
  };

  if (loading) return <p className="p-4">Loading notifications...</p>;

  if (!notifications || notifications.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        No notifications yet 📭
      </div>
    );
  }

  return (
    <section className="p-6 lg:pl-[320px]">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>

      <ul className="flex flex-col gap-3">
        {notifications.map((n) => (
          <li
            key={n._id}
            onClick={() => handleClick(n)}
            className={`cursor-pointer p-4 rounded-md border transition-all
              ${n.isRead ? "bg-gray-100" : "bg-white border-red-400"}
            `}
          >
            <p className="font-medium">{n.message}</p>
            <span className="text-xs text-gray-500">
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Notifications;
