import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import AnimatedTitle from "./AnimatedTitle"; // Add this import

const ChatMessage = ({ message }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const isThought = message.event === "thought";

    const handleRender = (ast) => {
        //console.log("Parsed AST:", ast);
    };

    return (

        <div className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`inline-block p-3 rounded-lg max-w-[80%] ${message.role === "user"
                ? "bg-blue-500 text-white"
                : message.isError
                    ? "bg-red-100 text-red-700"
                    : isThought
                        ? "bg-gray-100 text-gray-700"
                        : "bg-gray-200 text-gray-800"
                }`}
            >
                <AnimatedTitle fontSize={32} />

                {isThought && (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="flex items-center gap-2 mb-2 text-gray-600 hover:text-gray-800"
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
                                            fontSize: '0.875rem', // 14px
                                            margin: '0.5rem 0',
                                        }}
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={`${className} text-sm`} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            ul: ({ node, ordered, ...props }) => <ul style={{ paddingLeft: '2em', listStyleType: 'disc', marginTop: '0.5em', marginBottom: '0.5em' }} {...props} />,
                            ol: ({ node, ordered, ...props }) => <ol style={{ paddingLeft: '2em', listStyleType: 'decimal', marginTop: '0.5em', marginBottom: '0.5em' }} {...props} />,
                            li: ({ node, ...props }) => <li style={{ marginBottom: '0.25em' }} {...props} />,
                        }}
                        onRender={handleRender}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;