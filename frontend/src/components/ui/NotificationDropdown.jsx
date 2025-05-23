import React, { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import Avatar from "../ui/Avatar";
import  useSocketStore  from '../../store/socketStore';
const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, getMyNotifications,acceptFriendRequest} = useUserStore();

// In NotificationDropdown.jsx
useEffect(() => {
  getMyNotifications();
}, [getMyNotifications]);
  return (
    <div className="relative">
      
       <button 
        className="p-2 rounded-full hover:bg-base-300 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5 text-base-content" />
        {notifications?.length > 0 && (
          <span className="absolute -top-1 -right-1 badge badge-error text-xs h-4 w-4 p-0 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

     
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-base-100 rounded-md shadow-lg z-50 border border-base-300">
         
          <div className="flex justify-between items-center p-3 border-b border-base-300">
            <h3 className="font-medium text-base-content">Notifications</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-base-content hover:text-error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-64 overflow-y-auto">
            {notifications?.length === 0 ? (
              <div className="p-4 text-center text-base-content/70">
                No new notifications
              </div>
            ) : (
              <ul className="divide-y divide-base-300">
                {notifications?.map((notification) => (
                  <li key={notification._id} className="p-3 hover:bg-base-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <Avatar
                              src={notification.sender.profile}
                              alt={notification.sender.name}
                              />
                          </div>
                        <div>
                          <p className="text-sm font-medium text-base-content">
                            {notification.sender.name}
                          </p>
                          <p className="text-xs text-base-content/70">
                            Sent you a friend request
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>acceptFriendRequest(notification._id,true)}
                          className="btn btn-xs btn-circle btn-success"
                          aria-label="Accept"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() =>acceptFriendRequest(notification._id,false)} 
                          className="btn btn-xs btn-circle btn-error"
                          aria-label="Reject"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )} 
    </div>
  );
};

export default NotificationDropdown;