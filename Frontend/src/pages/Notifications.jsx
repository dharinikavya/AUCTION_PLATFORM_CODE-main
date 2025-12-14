import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markReadNotifications,
} from "@/store/slice/userSlice";

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchNotifications());

    // Mark as read silently when page opens
    dispatch(markReadNotifications());
  }, [dispatch]);

  return (
    <section className="px-5 pt-20 lg:pl-[320px]">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>

      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`border p-3 rounded ${
                n.isRead ? "bg-white" : "bg-red-50"
              }`}
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

