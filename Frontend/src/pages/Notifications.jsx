import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markReadNotifications,
} from "@/store/slice/userSlice";
import { RiNotification3Fill } from "react-icons/ri";

const Notifications = () => {
  const dispatch = useDispatch();

  const { notifications, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(markReadNotifications());
  }, []);

  return (
    <section className="w-full px-5 pt-20 lg:pl-[320px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <RiNotification3Fill className="text-3xl text-red-500" />
        <h2 className="text-2xl font-bold">Notifications</h2>
      </div>

      {/* Empty State */}
      {!loading && notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
          <RiNotification3Fill className="text-6xl mb-4" />
          <p className="text-lg font-semibold">No notifications yet</p>
          <p className="text-sm">
            You’ll see updates when you win auctions or receive alerts.
          </p>
        </div>
      )}

      {/* Notifications List */}
      <div className="flex flex-col gap-4">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`p-4 rounded-lg border shadow-sm transition-all ${
              notification.isRead
                ? "bg-white border-gray-300"
                : "bg-red-50 border-red-400"
            }`}
          >
            <p className="font-semibold text-gray-800">
              {notification.message}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Notifications;
