import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markReadNotifications,
  fetchLeaderBoard,
} from "@/store/slice/userSlice";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notifications } = useSelector((state) => state.user);

  /* ================= ON PAGE OPEN ================= */
  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchLeaderBoard()); // 🔄 force leaderboard refresh
  }, [dispatch]);

  /* ================= REMOVE DUPLICATES (SAFE) ================= */
  const uniqueNotifications = useMemo(() => {
    const seen = new Set();
    return notifications.filter((n) => {
      const key = `${n.message}-${n.auction}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [notifications]);

  /* ================= CLICK HANDLER ================= */
  const handleClick = (notification) => {
    dispatch(markReadNotifications());
    navigate(`/auction/details/${notification.auction}`);
  };

  return (
    <section className="pt-24 px-6 lg:pl-[320px]">
      <h2 className="text-2xl font-bold mb-6">🔔 Notifications</h2>

      {uniqueNotifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {uniqueNotifications.map((n) => (
            <li
              key={n._id}
              onClick={() => handleClick(n)}
              className={`p-4 rounded border cursor-pointer transition
                ${
                  n.isRead
                    ? "bg-gray-100"
                    : "bg-red-50 border-red-400"
                }
              `}
            >
              <p className="font-semibold">{n.message}</p>
              <p className="text-sm text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Notifications;
