import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import type { Metadata } from "next"
import MouseMoveEffect from "@/components/mouse-move-effect"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import ChatButton from "@/components/chat-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PillPal - Your AI Health Companion",
  description: "Empowering your health journey with AI-powered medication management and expert guidance.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MouseMoveEffect />
          <Navbar />
          {children}
          <ChatButton />
        </ThemeProvider>
      </body>
    </html>
  )
}