import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { SSEParser } from "../utils/sse";

const ChatContext = createContext(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll functionality
  const scrollToBottom = () => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;
    
    const isScrolledNearBottom =
      chatContainer.scrollHeight -
      chatContainer.scrollTop -
      chatContainer.clientHeight < 100;

    if (isScrolledNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Error handling
  const handleError = (error) => {
    const errorTypes = {
      TypeError: {
        "Failed to fetch": "Unable to connect to the server. Please check your internet connection.",
      },
      AbortError: "Request timed out. Please try again.",
      SyntaxError: "Received invalid response from server.",
      429: "Too many requests. Please wait a moment before trying again.",
      503: "Service temporarily unavailable. Please try again later.",
    };

    let errorMessage =
      errorTypes[error.name]?.[error.message] ||
      errorTypes[error.status] ||
      `Server error (${error.status || "unknown"}). Please try again later.`;

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: errorMessage, isError: true },
    ]);
  };

  // Initialize conversation
  useEffect(() => {
    const initializeConversation = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8001/conversation", {
          method: "POST",
        });

        if (!response.ok) {
          throw { status: response.status, statusText: response.statusText };
        }

        const data = await response.json();
        setConversationId(data.conversation_id);
      } catch (error) {
        console.error("Error initializing conversation:", error);
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeConversation();
  }, []);

  // Submit message
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || !conversationId || isLoading) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    let controller;
    try {
      controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("http://localhost:8001/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: userMessage,
          conversation_id: conversationId,
          files: [],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw { status: response.status, statusText: response.statusText };
      }

      const reader = response.body.getReader();
      const sseParser = new SSEParser();

      let assistantMessageStarted = false;

      for await (const event of sseParser.processStream(reader)) {
        if (event.data) {
          setMessages((prev) => {
            // Only attempt to merge if we've started an assistant message
            if (assistantMessageStarted && 
                prev.length > 0 && 
                prev[prev.length - 1].role === "assistant" && 
                prev[prev.length - 1].event === event.event &&
                !prev[prev.length - 1].isError) {
              // Merge with existing message
              return [
                ...prev.slice(0, -1),
                {
                  ...prev[prev.length - 1],
                  content: prev[prev.length - 1].content + event.data,
                },
              ];
            } else {
              // Start a new assistant message
              assistantMessageStarted = true;
              return [
                ...prev,
                {
                  role: "assistant",
                  content: event.data,
                  event: event.event,
                  isError: false,
                },
              ];
            }
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider
      value={{
        input,
        setInput,
        messages,
        setMessages,
        isLoading,
        conversationId,
        handleSubmit,
        clearChat,
        messagesEndRef,
        chatContainerRef,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};