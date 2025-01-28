import React from "react";

const ChatMessage = ({ message }) => {
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
              : "bg-gray-200 text-gray-800"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};
export default ChatMessage;
