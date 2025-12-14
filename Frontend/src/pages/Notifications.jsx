import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markReadNotifications } from "@/store/slice/userSlice";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notifications } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, []);

  const handleClick = (notification) => {
    dispatch(markReadNotifications());
    navigate(`/auction/details/${notification.auction}`);
  };

  return (
    <section className="pt-24 px-6 lg:pl-[320px]">
      <h2 className="text-2xl font-bold mb-6">🔔 Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {notifications.map((n) => (
            <li
              key={n._id}
              onClick={() => handleClick(n)}
              className={`p-4 rounded border cursor-pointer transition
                ${n.isRead ? "bg-gray-100" : "bg-red-50 border-red-400"}
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
