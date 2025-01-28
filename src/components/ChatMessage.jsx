import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ChatMessage = ({ message }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isThought = message.event === "thought";

  return (
    <div
      className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
    >
      <div
        className={`inline-block p-3 rounded-lg ${
          message.role === "user"
            ? "bg-blue-500 text-white"
            : message.isError
              ? "bg-red-100 text-red-700"
              : isThought
                ? "bg-gray-100 text-gray-700"
                : "bg-gray-200 text-gray-800"
        }`}
      >
        {isThought && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-2 mb-2 text-gray-600 hover:text-gray-800"
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">思考过程</span>
          </button>
        )}
        <div className={isThought && isCollapsed ? "hidden" : "block"}>
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;