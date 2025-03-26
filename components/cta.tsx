'use client'
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CTA() {
  return (
    <section className="border-t">
      <div className="container flex flex-col items-center gap-4 py-24 text-center md:py-32">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
          Your Complete Healthcare Companion
        </h2>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Experience the future of healthcare with PillPal's suite of intelligent tools. From medication reminders to finding the perfect healthcare provider, we're here to make your healthcare journey smarter and more personalized.
        </p>
        <div className="flex gap-4">
          <Link href="/pillping" className="mt-4">
            <Button size="lg" aria-label="Get Started with PillPing">
              Get Started with PillPing
            </Button>
          </Link>
          <Link href="/medimatch" className="mt-4">
            <Button variant="outline" size="lg" aria-label="Find Your Match">
              Find Your Match
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
