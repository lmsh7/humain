import React from 'react';
import { MessageSquare } from 'lucide-react';

const Header = ({ children }) => {
  return (
    <header className="py-3 px-4 border-b dark:border-gray-700 transition-colors duration-200">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MessageSquare className="text-blue-500" />
          <h1 className="text-xl font-semibold">聊天应用</h1>
        </div>
        <div className="flex items-center">
          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;