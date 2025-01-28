import React, { useState, useEffect } from "react";
import { SSEParser } from "../utils/sse";

const useChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const handleError = (error) => {
    const errorTypes = {
      TypeError: {
        "Failed to fetch":
          "Unable to connect to the server. Please check your internet connection.",
      },
      AbortError: "Request timed out. Please try again.",
      SyntaxError: "Received invalid response from server.",
      429: "Too many requests. Please wait a moment before trying again.",
      503: "Service temporarily unavailable. Please try again later.",
    };

    let errorMessage =
      errorTypes[error.name]?.[error.message] ||
      errorTypes[error.status] ||
      `Server error (${error.status}). Please try again later.`;

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

        if (!response.ok)
          throw { status: response.status, statusText: response.statusText };

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: userMessage,
          conversation_id: conversationId,
          files: [],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok)
        throw { status: response.status, statusText: response.statusText };

      const reader = response.body.getReader();
      const sseParser = new SSEParser();

      for await (const event of sseParser.processStream(reader)) {
    
        console.log("Event:", event);
        if (event.data) {
          setMessages((prev) => {
            // 获取最后一条消息
            const lastMessage = prev[prev.length - 1];
            // 合并条件：最后一条存在且类型相同、角色是助手、且不是错误消息
            if (
              lastMessage &&
              lastMessage.event === event.event &&
              lastMessage.role === "assistant" &&
              !lastMessage.isError
            ) {
              // 合并到现有消息
              const mergedMessages = [
                ...prev.slice(0, -1),
                {
                  ...lastMessage,
                  content: lastMessage.content + event.data,
                },
              ];
              return mergedMessages;
            }

            // 添加新消息
            return [
              ...prev,
              {
                role: "assistant",
                content: event.data,
                event: event.event,
                isError: false,
              },
            ];
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
