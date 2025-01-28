import React, { useRef, useEffect } from "react";

const useChatScroll = (messages) => {
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    const chatContainer = chatContainerRef.current;
    const isScrolledNearBottom =
      chatContainer &&
      chatContainer.scrollHeight -
        chatContainer.scrollTop -
        chatContainer.clientHeight <
        100;

    if (isScrolledNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return { messagesEndRef, chatContainerRef };
};
export default useChatScroll;
