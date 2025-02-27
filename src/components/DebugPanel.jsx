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
import { useChatContext } from "../context/ChatContext";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const DebugPanel = ({ showDebug = false }) => {
  const { messages = [], isLoading, conversationId } = useChatContext();
  const { isDarkMode } = useContext(ThemeContext);
  const [showMessages, setShowMessages] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState(new Set());

  if (!showDebug) return null;

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
    <div className={`fixed bottom-4 right-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-800 text-white'} p-4 rounded-lg shadow-lg max-w-sm opacity-90 space-y-3 max-h-[80vh] overflow-y-auto z-50`}>
      <div className="flex items-center gap-2 border-b border-gray-600 pb-2">
        <AlertCircle size={16} className="text-yellow-400" />
        <span className="font-semibold">调试信息</span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Database size={14} />
          <span className="text-gray-300">对话ID:</span>
          <span
            className={`font-mono ${conversationId ? "text-green-400" : "text-red-400"}`}
          >
            {conversationId || "未初始化"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Timer size={14} />
          <span className="text-gray-300">连接状态:</span>
          <span className="flex items-center gap-1">
            {isLoading ? (
              <span className="text-yellow-400">处理中</span>
            ) : (
              <span className="text-green-400 flex items-center gap-1">
                <Check size={14} />
                就绪
              </span>
            )}
          </span>
        </div>

        <div className="pt-2 border-t border-gray-600">
          <div className="text-gray-300 mb-1">消息统计:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-700 p-2 rounded">
              总计: {messages.length}
            </div>
            <div className="bg-gray-700 p-2 rounded">
              用户: {messages.filter((m) => m.role === "user").length}
            </div>
            <div className="bg-gray-700 p-2 rounded">
              助手: {messages.filter((m) => m.role === "assistant").length}
            </div>
            <div className="bg-gray-700 p-2 rounded">
              错误: {messages.filter((m) => m.isError).length}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-600">
          <button
            onClick={() => setShowMessages(!showMessages)}
            className="flex items-center gap-2 w-full text-left text-gray-300 hover:text-white"
          >
            <MessageCircle size={14} />
            <span>消息详情</span>
            {showMessages ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>

          {showMessages && messages.length > 0 && (
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
                      {message.role === "user" ? "用户" : "助手"} - {message.content?.slice(0, 30) || ""}...
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
                          <span className="text-gray-400">角色: </span>
                          <span className="text-white">{message.role === "user" ? "用户" : "助手"}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">错误: </span>
                          <span className="text-white">
                            {message.isError ? "是" : "否"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">
                            内容长度: 
                          </span>
                          <span className="text-white">
                            {message.content?.length || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">内容: </span>
                          <pre className="mt-1 whitespace-pre-wrap break-words text-white">
                            {message.content || ""}
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