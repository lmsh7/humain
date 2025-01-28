import React, { useState, useEffect } from "react";
import { SSEParser } from "../utils/sse";

const useChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const handleError = (error) => {
    let errorMessage = "An error occurred while sending your message.";

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      errorMessage =
        "Unable to connect to the server. Please check your internet connection.";
    } else if (error.name === "AbortError") {
      errorMessage = "Request timed out. Please try again.";
    } else if (error instanceof SyntaxError) {
      errorMessage = "Received invalid response from server.";
    } else if (error.status) {
      switch (error.status) {
        case 429:
          errorMessage =
            "Too many requests. Please wait a moment before trying again.";
          break;
        case 503:
          errorMessage =
            "Service temporarily unavailable. Please try again later.";
          break;
        default:
          errorMessage = `Server error (${error.status}). Please try again later.`;
      }
    }

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: errorMessage, isError: true },
    ]);
  };

  useEffect(() => {
    const initializeConversation = async () => {
      try {
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
      }
    };

    initializeConversation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("http://localhost:8001/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      let assistantMessage = "";

      for await (const parsedEvent of sseParser.processStream(reader)) {
        if (parsedEvent.data) {
          assistantMessage += parsedEvent.data;
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage?.role === "assistant") {
              lastMessage.content = assistantMessage;
              return [...newMessages];
            } else {
              return [
                ...newMessages,
                { role: "assistant", content: assistantMessage },
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

  return {
    input,
    setInput,
    messages,
    isLoading,
    conversationId,
    handleSubmit,
  };
};

export default useChat;
