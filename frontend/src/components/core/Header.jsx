import React, { useState } from 'react';
import { Bell } from 'lucide-react';
const Header = () => {
  const [notifications, setNotifications] = useState(3);

  return (
    <div className="w-full h-16 bg-base-200 text-base-content flex items-center justify-between px-6 shadow sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-semibold">ChatApp</h1>
      </div>

      <div className="flex items-center space-x-4">

        {/* Notifications */}
        <div className="indicator">
          <button className="btn btn-circle btn-ghost">
            <Bell className="w-5 h-5" />
          </button>
          {notifications > 0 && (
            <span className="indicator-item badge badge-error text-[10px] h-4 w-4 p-0 left-1/2 top-3 ">
              {notifications}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
