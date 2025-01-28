import React from "react";

const ChatInput = ({
  input,
  setInput,
  onSubmit,
  isLoading,
  conversationId,
}) => {
  return (
    <form onSubmit={onSubmit} className="border-t p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder={
            conversationId
              ? "Type your message..."
              : "Initializing conversation..."
          }
          disabled={isLoading || !conversationId}
        />
        <button
          type="submit"
          disabled={isLoading || !conversationId}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          Send
        </button>
      </div>
    </form>
  );
};
export default ChatInput;
