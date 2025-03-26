"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Activity, TrendingUp, Heart, Brain } from "lucide-react"

export default function MediChirpPage() {
  const [posts] = useState([
    {
      id: 1,
      author: "Dr. Sarah Chen",
      role: "Cardiologist",
      content: "Just published a new article about heart health and lifestyle changes. Check it out!",
      likes: 24,
      comments: 8,
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      author: "Health Coach Mike",
      role: "Wellness Expert",
      content: "Tips for maintaining a healthy lifestyle during busy work days. What works for you?",
      likes: 18,
      comments: 12,
      timestamp: "4 hours ago"
    },
    {
      id: 3,
      author: "Dr. Emily Rodriguez",
      role: "Nutritionist",
      content: "New research shows the benefits of Mediterranean diet for heart health. Would you like to learn more?",
      likes: 32,
      comments: 15,
      timestamp: "6 hours ago"
    }
  ])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">MediChirp</h1>
          <p className="text-muted-foreground">Connect with healthcare professionals and share insights</p>
        </div>
        <Button className="gap-2">
          <MessageSquare className="w-4 h-4" />
          New Post
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Latest Updates
            </CardTitle>
            <CardDescription>Stay connected with the healthcare community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="p-4 rounded-lg border">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{post.author}</h3>
                        <span className="text-sm text-muted-foreground">{post.role}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                      </div>
                      <p className="mt-2">{post.content}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Heart className="w-4 h-4" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <MessageSquare className="w-4 h-4" />
                          {post.comments}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Trending Topics
            </CardTitle>
            <CardDescription>Popular discussions in healthcare</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer">
                <Activity className="w-4 h-4" />
                <span>Mental Health Awareness</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer">
                <Brain className="w-4 h-4" />
                <span>Stress Management</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer">
                <Heart className="w-4 h-4" />
                <span>Heart Health</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer">
                <Activity className="w-4 h-4" />
                <span>Exercise & Fitness</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 