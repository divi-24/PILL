import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="container flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
      <div className="space-y-4">
        <h2 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
          Your Smart Healthcare Companion
          <br />
          <strong>PillPal</strong>
        </h2>
        <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Experience the future of healthcare with PillPal&apos;s suite of intelligent tools. From medication reminders to AI-powered health insights, we&apos;re here to make your healthcare journey smarter and more personalized.
        </p>
      </div>
      <div className="flex gap-4">
        <Button size="lg">
          <Link href="/pillping" className="transition-colors hover:text-primary">
            Get Started with PillPing
          </Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/medimatch" className="transition-colors hover:text-primary">
            Find Your Match
          </Link>
        </Button>
      </div>
    </section>
  );
}
