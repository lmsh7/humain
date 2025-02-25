import React, { useContext } from "react";
import ChatMessage from "./ChatMessage";
import { useChatContext } from "../context/ChatContext";
import { ThemeContext } from "../context/ThemeContext";

const ChatContainer = () => {
  const { messages, isLoading, chatContainerRef, messagesEndRef } = useChatContext();
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div 
      ref={chatContainerRef} 
      className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
    >
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            <h2 className="text-xl font-semibold mb-2">Welcome to the Chat</h2>
            <p>Type a message to start a conversation</p>
          </div>
        </div>
      ) : (
        messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            message={message} 
            isDarkMode={isDarkMode}
          />
        ))
      )}
      
      {isLoading && (
        <div className="flex items-center justify-center py-2">
          <div className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} flex items-center`}>
            <div className="animate-pulse flex space-x-1">
              <div className="h-2 w-2 bg-current rounded-full"></div>
              <div className="h-2 w-2 bg-current rounded-full"></div>
              <div className="h-2 w-2 bg-current rounded-full"></div>
            </div>
            <span className="ml-2">Thinking...</span>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContainer;