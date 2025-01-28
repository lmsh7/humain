import React from "react";
import ChatContainer from "./components/ChatContainer";
import ChatInput from "./components/ChatInput";
import useChat from "./hooks/useChat";
import useChatScroll from "./hooks/useChatScroll";

function App() {
  const { input, setInput, messages, isLoading, conversationId, handleSubmit } =
    useChat();

  const { messagesEndRef, chatContainerRef } = useChatScroll(messages);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
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
  );
}

export default App;
