import { useState, useRef, useEffect } from 'react'

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  const scrollToBottom = () => {
    const chatContainer = chatContainerRef.current
    const isScrolledNearBottom = chatContainer && 
      (chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 100)

    if (isScrolledNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const initializeConversation = async () => {
      try {
        const response = await fetch('http://localhost:8001/conversation', {
          method: 'POST'
        })
        
        if (!response.ok) {
          throw { status: response.status, statusText: response.statusText }
        }

        const data = await response.json()
        setConversationId(data.conversation_id)
      } catch (error) {
        console.error('Error initializing conversation:', error)
        handleError(error)
      }
    }

    initializeConversation()
  }, [])

  const handleError = (error) => {
    let errorMessage = 'An error occurred while sending your message.'
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      errorMessage = 'Unable to connect to the server. Please check your internet connection.'
    } else if (error.name === 'AbortError') {
      errorMessage = 'Request timed out. Please try again.'
    } else if (error instanceof SyntaxError) {
      errorMessage = 'Received invalid response from server.'
    } else if (error.status) {
      // Handle HTTP errors
      switch (error.status) {
        case 429:
          errorMessage = 'Too many requests. Please wait a moment before trying again.'
          break
        case 503:
          errorMessage = 'Service temporarily unavailable. Please try again later.'
          break
        default:
          errorMessage = `Server error (${error.status}). Please try again later.`
      }
    }

    setMessages(prev => [...prev, { role: 'assistant', content: errorMessage, isError: true }])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || !conversationId) return

    const userMessage = input
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setInput('')
    setIsLoading(true)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch('http://localhost:8001/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: userMessage,
          conversation_id: conversationId,
          files: []
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw { status: response.status, statusText: response.statusText }
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.trim()) {
            try {
              const parsed = JSON.parse(line)
              if (parsed.event === 'message' && parsed.data) {
                assistantMessage += parsed.data
                setMessages(prev => {
                  const newMessages = [...prev]
                  const lastMessage = newMessages[newMessages.length - 1]
                  if (lastMessage?.role === 'assistant') {
                    lastMessage.content = assistantMessage
                    return [...newMessages]
                  } else {
                    return [...newMessages, { role: 'assistant', content: assistantMessage }]
                  }
                })
              }
            } catch (e) {
              console.error('Error parsing SSE message:', e)
              throw new SyntaxError('Invalid server response format')
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
        <div 
          ref={chatContainerRef}
          className="h-[500px] overflow-y-auto p-4"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.isError
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-center text-gray-500">
              Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder={conversationId ? "Type your message..." : "Initializing conversation..."}
              disabled={isLoading || !conversationId}
            />
            <button
              type="submit"
              disabled={isLoading || !conversationId}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App