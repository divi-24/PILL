'use client'

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { 
  Pill, 
  Brain, 
  Stethoscope, 
  Calendar, 
  MessageSquare, 
  MapPin 
} from "lucide-react"

const features = [
  {
    title: "PillPing",
    description: "Smart medication reminders and tracking system",
    icon: Pill,
    color: "text-primary",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "MediGuide",
    description: "AI-powered health insights and recommendations",
    icon: Brain,
    color: "text-secondary",
    gradient: "from-secondary/20 to-secondary/5",
  },
  {
    title: "PillBot",
    description: "24/7 AI health assistant for your queries",
    icon: MessageSquare,
    color: "text-primary",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "MediSpot",
    description: "Find nearby healthcare facilities and pharmacies",
    icon: MapPin,
    color: "text-secondary",
    gradient: "from-secondary/20 to-secondary/5",
  },
  {
    title: "MediMatch",
    description: "Connect with healthcare providers",
    icon: Stethoscope,
    color: "text-primary",
    gradient: "from-primary/20 to-primary/5",
  },
]

export default function FeatureShowcase() {
  return (
    <section className="py-16 bg-gradient-to-b from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Our Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover how PillPal can help you manage your health journey with our comprehensive suite of features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className={`p-6 bg-gradient-to-br ${feature.gradient} hover:shadow-lg transition-all duration-300 border-0`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-primary/10 ${feature.color} transform transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 