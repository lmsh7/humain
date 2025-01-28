import React, { useState } from "react";
import ChatContainer from "./components/ChatContainer";
import ChatInput from "./components/ChatInput";
import DebugPanel from "./components/DebugPanel";
import useChat from "./hooks/useChat";
import useChatScroll from "./hooks/useChatScroll";

function App() {
  const { input, setInput, messages, isLoading, conversationId, handleSubmit } =
    useChat();
  const { messagesEndRef, chatContainerRef } = useChatScroll(messages);
  const [showDebug, setShowDebug] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          >
            {showDebug ? "Hide Debug" : "Show Debug"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <ChatContainer
            messages={messages}
            isLoading={isLoading}
            chatContainerRef={chatContainerRef}
            messagesEndRef={messagesEndRef}
          />
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            conversationId={conversationId}
          />
        </div>
      </div>

      <DebugPanel
        conversationId={conversationId}
        messages={messages}
        isLoading={isLoading}
        toggleDebug={showDebug}
      />
    </div>
  );
}

export default App;
