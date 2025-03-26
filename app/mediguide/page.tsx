"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, Loader2, AlertCircle, Mic, MicOff, Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useFileUpload } from "@/hooks/use-file-upload"

export default function MediGuide() {
  const [medicineName, setMedicineName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.trim()
          setMedicineName(transcript)
          setIsListening(false)
          // Only trigger search if we have valid text
          if (transcript) {
            handleSearch()
          }
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
          setError("Failed to recognize speech. Please try again.")
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        setRecognition(recognition)
      }
    }
  }, [])

  const handleSearch = async () => {
    const trimmedMedicineName = medicineName.trim()
    if (!trimmedMedicineName) {
      setError("Please enter a medicine name")
      return
    }

    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("https://mediguide-8p26.onrender.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ medicine: trimmedMedicineName }),
      })

      if (!response.ok) throw new Error("Failed to fetch results")
      
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("Failed to fetch results. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMedicineName(value)
    // Clear error when user starts typing
    if (value.trim()) {
      setError("")
    }
  }

  const toggleListening = () => {
    if (!recognition) {
      setError("Speech recognition is not supported in your browser")
      return
    }

    if (isListening) {
      recognition.stop()
    } else {
      setError("")
      recognition.start()
      setIsListening(true)
    }
  }

  const handleImageUpload = async (file: File) => {
    setIsLoading(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("https://mediguide-8p26.onrender.com/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to upload image")
      
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("Failed to upload image. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const {
    isDragging,
    error: uploadError,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileSelect,
  } = useFileUpload({
    onFileSelect: handleImageUpload,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  return (
    <div className="container py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MediGuide
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            Your comprehensive guide to medications and health information
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Input
                    placeholder="Enter medicine name"
                    value={medicineName}
                    onChange={handleInputChange}
                    className="pr-12"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={toggleListening}
                    disabled={isLoading}
                  >
                    {isListening ? (
                      <MicOff className="h-4 w-4 text-destructive animate-pulse" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Card 
                  className={`p-8 cursor-pointer transition-colors ${
                    isDragging ? "bg-primary/10 border-primary" : "hover:bg-accent/50"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-primary/10">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-center space-y-1">
                      <span className="text-lg font-medium block">
                        {isDragging ? "Drop your medicine image here" : "Upload Medicine Image"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Drag and drop or click to select
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                </Card>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Error Messages */}
        <AnimatePresence>
          {(error || uploadError) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <Card className="p-4 bg-destructive/10 text-destructive">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error || uploadError}</span>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Results</h2>
                <pre className="bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 