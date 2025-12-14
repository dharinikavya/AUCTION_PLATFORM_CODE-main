import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markReadNotifications,
} from "@/store/slice/userSlice";
import { IoNotifications } from "react-icons/io5";

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    dispatch(fetchNotifications());
  }, []);

  const handleOpen = () => {
    setOpen(!open);
    if (unreadCount > 0) dispatch(markReadNotifications());
  };

  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative text-2xl">
        <IoNotifications />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
          <h3 className="p-3 font-bold border-b">Notifications</h3>

          {notifications.length === 0 ? (
            <p className="p-4 text-gray-500">No notifications</p>
          ) : (
            notifications.map((n, i) => (
              <div
                key={i}
                className={`p-3 border-b text-sm ${
                  !n.isRead ? "bg-gray-100 font-semibold" : ""
                }`}
              >
                {n.message}
                <p className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
