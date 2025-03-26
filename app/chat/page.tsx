"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Bot, User, Loader2, AlertCircle, RefreshCcw, Mic, MicOff, Volume2, VolumeX, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  content: string
  sender: "user" | "bot"
  timestamp: string
  error?: boolean
  errorType?: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "👋 Hello! I'm your AI health assistant. I can help you with:\n\n• Understanding medications and their effects\n• General health information and wellness tips\n• Medical terminology explanations\n• Lifestyle recommendations\n\nHow can I assist you today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessingVoice, setIsProcessingVoice] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        await processAudioToText(audioBlob)
        stream.getTracks().forEach(track => track.stop())
        setIsRecording(false)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Error accessing microphone. Please ensure you have granted microphone permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }

  const processAudioToText = async (audioBlob: Blob) => {
    setIsProcessingVoice(true)
    try {
      const reader = new FileReader()
      reader.readAsDataURL(audioBlob)
      reader.onloadend = async () => {
        const base64Audio = reader.result as string
        const base64Data = base64Audio.split(',')[1]

        const response = await fetch('/api/speech-to-text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ audio: base64Data }),
        })

        if (!response.ok) {
          throw new Error('Failed to convert speech to text')
        }

        const data = await response.json()
        setInput(data.text)
        setIsProcessingVoice(false)
      }
    } catch (error) {
      console.error('Error processing audio:', error)
      setIsProcessingVoice(false)
      alert('Error processing audio. Please try again.')
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to get response")
      }
      
      if (!data.reply) {
        throw new Error("No response received from the AI")
      }

      const botMessage: Message = {
        id: messages.length + 2,
        content: data.reply,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
      }
      
      setMessages(prev => [...prev, botMessage])
      setRetryCount(0) // Reset retry count on success
    } catch (error: any) {
      console.error("Error:", error)
      
      let errorMessage = "I apologize, but I'm having trouble processing your request. Please try again."
      let errorType = "General error"

      if (error.message.includes("API quota exceeded")) {
        errorMessage = "I'm currently experiencing high demand. Please try again in a few minutes."
        errorType = "API quota exceeded"
      } else if (error.message.includes("API configuration error")) {
        errorMessage = "There's an issue with the AI service configuration. Please try again later."
        errorType = "API configuration error"
      } else if (error.message.includes("API connection error")) {
        errorMessage = "I'm having trouble connecting to the AI service. Please check your internet connection."
        errorType = "API connection error"
      }

      const errorResponse: Message = {
        id: messages.length + 2,
        content: errorMessage,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        error: true,
        errorType
      }
      
      setMessages(prev => [...prev, errorResponse])
      setRetryCount(prev => prev + 1)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    if (retryCount < 3) {
      handleSend()
    }
  }

  const speakText = async (text: string) => {
    try {
      if (isSpeaking && audioRef.current) {
        audioRef.current.pause()
      }

      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 403) {
          alert('Text-to-speech is not enabled. Please contact support to enable this feature.');
          return;
        }
        if (response.status === 401) {
          alert('Authentication error. Please try again later.');
          return;
        }
        throw new Error(data.error || 'Failed to convert text to speech');
      }

      const audioContent = data.audioContent

      // Create and play audio
      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`)
      audioRef.current = audio
      
      audio.onended = () => setIsSpeaking(false)
      audio.onplay = () => setIsSpeaking(true)
      audio.onpause = () => setIsSpeaking(false)
      
      await audio.play()
    } catch (error: any) {
      console.error('Error playing audio:', error)
      alert(error.message || 'Failed to play audio. Please try again.')
    }
  }

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsSpeaking(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            AI Health Assistant
          </h1>
          <p className="text-muted-foreground">Your trusted source for health information and medication guidance</p>
        </motion.div>

        <Card className="h-[calc(100vh-16rem)] flex flex-col bg-gradient-to-b from-background to-muted/20">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "flex",
                    message.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-start gap-2 max-w-[80%]",
                      message.sender === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-full",
                      message.sender === "user" ? "bg-primary" : "bg-muted"
                    )}>
                      {message.sender === "user" ? (
                        <User className="w-5 h-5 text-primary-foreground" />
                      ) : (
                        <Bot className="w-5 h-5 text-foreground" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "rounded-lg p-4",
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : message.error
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted"
                      )}
                    >
                      {message.error && (
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">
                            {message.errorType === "API quota exceeded" 
                              ? "Service Busy" 
                              : message.errorType === "API configuration error"
                              ? "Service Configuration Error"
                              : message.errorType === "API connection error"
                              ? "Connection Error"
                              : "Error"}
                          </span>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.sender === "bot" && !message.error && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => isSpeaking ? stopSpeaking() : speakText(message.content)}
                          >
                            {isSpeaking ? (
                              <VolumeX className="h-4 w-4" />
                            ) : (
                              <Volume2 className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp}
                      </span>
                      {message.error && retryCount < 3 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-xs"
                          onClick={handleRetry}
                        >
                          <RefreshCcw className="w-3 h-3 mr-1" />
                          Try Again
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-2 bg-muted rounded-lg p-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                disabled={isLoading || isProcessingVoice}
                className="flex-1"
              />
              <Button 
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading || isProcessingVoice}
                variant={isRecording ? "destructive" : "default"}
                className="min-w-[40px]"
              >
                {isRecording ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
              <Button 
                onClick={handleSend} 
                disabled={isLoading || isProcessingVoice}
                className="min-w-[40px]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 