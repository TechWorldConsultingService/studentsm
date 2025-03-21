import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";



const NotificationView = () => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!access) {
      toast.error("User not authenticated.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8000/api/messages/role/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      setNotifications(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error fetching notifications: " + (error.message || error));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [access, navigate]);

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.sent_at) - new Date(a.sent_at)
  );


  const renderTime = (isoString) => {
    if (!isoString) return "N/A";
    const dateObj = new Date(isoString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  

  return (
    <MainLayout>
      <div className="bg-purple-50 min-h-screen p-4 md:p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-purple-300 p-4 md:p-8">
          <h1 className="text-3xl font-extrabold text-purple-800 mb-4">Notifications</h1>

          {loading ? (
            <div className="text-center text-gray-600 mt-6">Loading notifications...</div>
          ) : sortedNotifications.length === 0 ? (
            <div className="text-center text-gray-600 mt-6">No notifications found.</div>
          ) : (
            <div className="flow-root mt-6">
              <ul role="list" className="-mb-8">
                {sortedNotifications.map((note, index) => {
                  const senderName = note?.sender
                    ? `${note.sender.first_name} ${note.sender.last_name}`
                    : "Unknown Sender";
                  const senderRole = note?.sender?.role || "Unknown";
                  // const roleClass = getRoleBadgeColor(senderRole);
                  const isLastItem = index === sortedNotifications.length - 1;

                  return (
                    <li key={note.id}>
                      <div className="relative pb-8">
                        {!isLastItem && (
                          <span
                            className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-300"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex items-start space-x-3">
                          <div>
                            <span className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center ring-8 ring-white text-white font-bold text-sm uppercase">
                              {senderName?.charAt(0) || "N"}
                            </span>
                          </div>

                          <div
                            className="min-w-0 flex-1 rounded-lg bg-purple-50 px-4 py-3 hover:bg-purple-100 transition-colors duration-200"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-sm font-semibold text-purple-800">
                                {senderName}{" "}
                                <span
                                  className={`ml-2 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-purple-500 text-white`}
                                >
                                  {senderRole}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500">{renderTime(note.sent_at)}</p>
                            </div>
                            <p className="text-gray-700 text-sm">
                              {note.message || "No message provided."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default NotificationView;
