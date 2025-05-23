import React, { useState } from 'react';
import NotificationDropdown from '../ui/NotificationDropdown';
const Header = () => {
  return (
    <div className="w-full h-16 bg-base-200 text-base-content flex items-center justify-between px-6 shadow sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-semibold">ChatApp</h1>
      </div>

      <div className="flex items-center space-x-4">

        {/* Notifications */}
          <NotificationDropdown />
      </div>
    </div>
  );
};

export default Header;
