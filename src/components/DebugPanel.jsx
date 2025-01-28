import React, { useState } from "react";
import {
  AlertCircle,
  Check,
  Timer,
  Database,
  ChevronDown,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

const DebugPanel = ({
  conversationId,
  messages,
  isLoading,
  toggleDebug = true,
}) => {
  const [showMessages, setShowMessages] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState(new Set());

  if (!toggleDebug) return null;

  const toggleMessage = (index) => {
    const newExpanded = new Set(expandedMessages);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedMessages(newExpanded);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm opacity-90 space-y-3 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center gap-2 border-b border-gray-600 pb-2">
        <AlertCircle size={16} className="text-yellow-400" />
        <span className="font-semibold">Debug Info</span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Database size={14} />
          <span className="text-gray-300">Conversation ID:</span>
          <span
            className={`font-mono ${conversationId ? "text-green-400" : "text-red-400"}`}
          >
            {conversationId || "Not initialized"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Timer size={14} />
          <span className="text-gray-300">Connection Status:</span>
          <span className="flex items-center gap-1">
            {isLoading ? (
              <span className="text-yellow-400">Processing</span>
            ) : (
              <span className="text-green-400 flex items-center gap-1">
                <Check size={14} />
                Ready
              </span>
            )}
          </span>
        </div>

        <div className="pt-2 border-t border-gray-600">
          <div className="text-gray-300 mb-1">Message Stats:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-700 p-2 rounded">
              Total: {messages.length}
            </div>
            <div className="bg-gray-700 p-2 rounded">
              User: {messages.filter((m) => m.role === "user").length}
            </div>
            <div className="bg-gray-700 p-2 rounded">
              Assistant: {messages.filter((m) => m.role === "assistant").length}
            </div>
            <div className="bg-gray-700 p-2 rounded">
              Errors: {messages.filter((m) => m.isError).length}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-600">
          <button
            onClick={() => setShowMessages(!showMessages)}
            className="flex items-center gap-2 w-full text-left text-gray-300 hover:text-white"
          >
            <MessageCircle size={14} />
            <span>Message Details</span>
            {showMessages ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>

          {showMessages && (
            <div className="mt-2 space-y-2">
              {messages.map((message, index) => (
                <div key={index} className="bg-gray-700 rounded p-2">
                  <button
                    onClick={() => toggleMessage(index)}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    <div
                      className={`flex-shrink-0 w-2 h-2 rounded-full ${
                        message.role === "user"
                          ? "bg-blue-400"
                          : message.isError
                            ? "bg-red-400"
                            : "bg-green-400"
                      }`}
                    />
                    <span className="text-xs">
                      {message.role} - {message.content.slice(0, 30)}...
                    </span>
                    {expandedMessages.has(index) ? (
                      <ChevronDown size={12} className="ml-auto" />
                    ) : (
                      <ChevronRight size={12} className="ml-auto" />
                    )}
                  </button>

                  {expandedMessages.has(index) && (
                    <div className="mt-2 pl-4 border-l-2 border-gray-600">
                      <div className="space-y-1 text-xs">
                        <div>
                          <span className="text-gray-400">Role: </span>
                          <span className="text-white">{message.role}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Error: </span>
                          <span className="text-white">
                            {message.isError?.toString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">
                            Content Length:{" "}
                          </span>
                          <span className="text-white">
                            {message.content.length}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Content: </span>
                          <pre className="mt-1 whitespace-pre-wrap break-words text-white">
                            {message.content}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
