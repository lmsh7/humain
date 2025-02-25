import React, { useContext, useRef } from "react";
import { Send, Trash2, Loader2 } from "lucide-react";
import { useChatContext } from "../context/ChatContext";
import { ThemeContext } from "../context/ThemeContext";

const ChatInput = () => {
  const { 
    input, 
    setInput, 
    messages, // 添加messages变量
    handleSubmit, 
    isLoading, 
    conversationId, 
    clearChat 
  } = useChatContext();
  
  const { isDarkMode } = useContext(ThemeContext);
  const inputRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4 transition-colors duration-200`}>
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={Math.min(4, Math.max(1, input.split('\n').length))}
            className={`w-full p-3 pr-10 border rounded-lg resize-none ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-800 focus:border-blue-400'
            } focus:ring-2 focus:ring-blue-300 focus:outline-none transition-colors duration-200`}
            placeholder={
              conversationId
                ? "Type your message... (Shift+Enter for new line)"
                : "Initializing conversation..."
            }
            disabled={isLoading || !conversationId}
          />
          {input && (
            <button
              type="button" 
              onClick={() => setInput('')}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none ${isDarkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
            >
              ✕
            </button>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !conversationId || !input.trim()}
          className={`p-3 rounded-lg ${
            isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:text-blue-300' 
              : 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300'
          } text-white transition-colors duration-200`}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
        
        <button
          type="button"
          onClick={clearChat}
          disabled={!messages || messages.length === 0 || isLoading}
          className={`p-3 rounded-lg ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600' 
              : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400'
          } transition-colors duration-200`}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;