import React, { useState } from 'react';
import { Bell, Sun, Moon } from 'lucide-react';
const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);

  return (
    <div className="w-full h-16 bg-gray-800 text-white flex items-center justify-between px-6">
    
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-semibold">ChatApp</h1>
      </div>
      <div className="flex items-center space-x-4">
       
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-700">
          {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-400" />}
        </button>
   
        <button className="relative p-2 rounded-full hover:bg-gray-700">
          <Bell className="text-white" />
          {notifications > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;
