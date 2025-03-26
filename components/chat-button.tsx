'use client'

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function ChatButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link href="/chat">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 
                       shadow-lg hover:shadow-xl transition-all duration-200
                       flex items-center justify-center
                       dark:shadow-[0_0_15px_rgba(0,64,128,0.3)] 
                       dark:hover:shadow-[0_0_20px_rgba(0,64,128,0.4)]"
          >
            <MessageCircle className="h-6 w-6 text-primary-foreground" />
          </Button>
        </motion.div>
      </Link>
    </motion.div>
  )
} 