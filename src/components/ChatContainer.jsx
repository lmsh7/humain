import ChatMessage from "./ChatMessage";
import React from "react";

const ChatContainer = ({
  messages,
  isLoading,
  chatContainerRef,
  messagesEndRef,
}) => {
  return (
    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
      {isLoading && (
        <div className="text-center text-gray-500">Thinking...</div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
export default ChatContainer;