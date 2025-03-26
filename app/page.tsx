"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { 
  Pill, 
  Brain, 
  MessageSquare, 
  MapPin, 
  Users,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Phone
} from "lucide-react"

const features = [
  {
    title: "PillPing",
    description: "Smart medication reminders and tracking system that helps you never miss a dose. Features include customizable schedules, medication history, and refill reminders.",
    icon: Pill,
    color: "from-primary to-primary/80",
    link: "/pillping",
    benefits: ["Smart reminders", "Medication history", "Refill tracking"]
  },
  {
    title: "MediGuide",
    description: "AI-powered health insights and personalized recommendations based on your medical history and current health status. Get expert guidance at your fingertips.",
    icon: Brain,
    color: "from-secondary to-secondary/80",
    link: "/mediguide",
    benefits: ["Personalized insights", "Health tracking", "Expert recommendations"]
  },
  {
    title: "PillBot",
    description: "24/7 AI health assistant that answers your medical queries instantly. Get reliable information about medications, symptoms, and general health concerns.",
    icon: MessageSquare,
    color: "from-primary to-primary/80",
    link: "/chat",
    benefits: ["24/7 support", "Instant answers", "Reliable information"]
  },
  {
    title: "MediSpot",
    description: "Advanced prescription scanning and text recognition system that converts handwritten prescriptions into digital format. Perfect for managing multiple prescriptions.",
    icon: MapPin,
    color: "from-secondary to-secondary/80",
    link: "/medispot",
    benefits: ["OCR technology", "Digital conversion", "Easy management"]
  },
  {
    title: "MediMatch",
    description: "Connect with healthcare providers, schedule appointments, and manage your medical records all in one place. Streamline your healthcare journey.",
    icon: Users,
    color: "from-primary to-primary/80",
    link: "/medimatch",
    benefits: ["Provider matching", "Appointment scheduling", "Record management"]
  }
]

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(46,125,50,0.1),transparent_50%)]" />
        
        <div className="container relative py-24 md:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PillPal
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">
              Your trusted AI-powered health companion for seamless medication management and expert guidance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/pillping">
                <Button className="btn-primary min-w-[160px] group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  variant="outline" 
                  className="btn-secondary min-w-[140px] text-primary hover:text-primary-foreground"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gradient-to-b from-background via-background to-primary/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Our Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover how PillPal can enhance your healthcare journey with our comprehensive suite of AI-powered tools
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Link href={feature.link}>
                  <div className="group relative overflow-hidden rounded-xl bg-card p-6 transition-all hover:shadow-xl h-full border hover:border-primary/20">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity group-hover:opacity-5`} />
                    <div className="relative space-y-4">
                      <div className="inline-flex rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                      <div className="pt-2">
                        <ul className="space-y-1">
                          {feature.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center text-sm text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mr-2" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2">
                        <span className="text-sm text-primary font-medium inline-flex items-center group-hover:translate-x-1 transition-transform">
                          Learn more
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/5 border-t">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PillPal</h3>
              <p className="text-muted-foreground">
                Empowering your health journey with AI-powered solutions
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                    Health Blog
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-muted-foreground hover:text-primary transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold mb-4">Stay Updated</h4>
              <p className="text-muted-foreground mb-4">
                Subscribe to our newsletter for health tips and updates.
              </p>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button className="w-full btn-primary">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} PillPal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

