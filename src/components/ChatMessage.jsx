import React, { useState, memo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatMessage = memo(({ message, isDarkMode = false }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const isThought = message.event === "thought";
    
    // 获取标题（如果存在）
    const hasTitleMatch = message.content?.match(/^#\s+(.+)$/m);
    const title = hasTitleMatch ? hasTitleMatch[1] : null;

    return (
        <div className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                message.role === "user"
                    ? isDarkMode 
                        ? "bg-blue-700 text-white" 
                        : "bg-blue-500 text-white"
                    : message.isError
                        ? isDarkMode 
                            ? "bg-red-900 text-red-200" 
                            : "bg-red-100 text-red-700"
                        : isThought
                            ? isDarkMode 
                                ? "bg-gray-700 text-gray-200" 
                                : "bg-gray-100 text-gray-700"
                            : isDarkMode 
                                ? "bg-gray-700 text-gray-100" 
                                : "bg-gray-200 text-gray-800"
                }`}
            >
                {title && (
                    <h3 className="text-xl font-bold mb-2">{title}</h3>
                )}

                {isThought && (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`flex items-center gap-2 mb-2 ${
                            isDarkMode ? "text-gray-300 hover:text-gray-100" : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        {isCollapsed ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronUp className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">思考过程</span>
                    </button>
                )}
                
                <div className={isThought && isCollapsed ? "hidden" : "block"}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={dracula}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{
                                            fontSize: '0.875rem',
                                            margin: '0.5rem 0',
                                            borderRadius: '0.25rem',
                                        }}
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={`${className} text-sm px-1 py-0.5 rounded ${
                                        isDarkMode ? "bg-gray-800" : "bg-gray-100"
                                    }`} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-3 mb-2" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-3 mb-1" {...props} />,
                            ul: ({ node, ...props }) => <ul className="pl-5 list-disc my-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="pl-5 list-decimal my-2" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                            a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" {...props} />
                        }}
                    >
                        {/* 如果存在标题，从内容中移除 */}
                        {title 
                            ? message.content.replace(/^#\s+(.+)$/m, '') 
                            : message.content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;