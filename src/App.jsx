import React, { useState } from "react";
import { ChatProvider } from "./context/ChatContext";
import { ThemeProvider } from "./context/ThemeContext";
import ChatContainer from "./components/ChatContainer";
import ChatInput from "./components/ChatInput";
import DebugPanel from "./components/DebugPanel";
import Header from "./components/Header";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <ThemeProvider>
      {(themeContext) => (
        <ChatProvider>
          <div className={`min-h-screen flex flex-col ${themeContext.isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} transition-colors duration-200`}>
            <Header>
              <ThemeToggle />
              <button
                onClick={() => setShowDebug(!showDebug)}
                className={`text-sm px-3 py-1 ${themeContext.isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded ml-2`}
              >
                {showDebug ? "隐藏调试" : "显示调试"}
              </button>
            </Header>
            
            <div className="flex-1 container mx-auto px-4 py-4 flex flex-col">
              <div className={`flex-1 ${themeContext.isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md flex flex-col transition-colors duration-200`}>
                <ChatContainer />
                <ChatInput />
              </div>
            </div>

            <DebugPanel showDebug={showDebug} />
          </div>
        </ChatProvider>
      )}
    </ThemeProvider>
  );
}

export default App;