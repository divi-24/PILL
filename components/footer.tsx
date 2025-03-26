'use client'

import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                            PillPal
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Empowering your health journey with AI-powered medication management and expert guidance.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/pillping" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    PillPing
                                </Link>
                            </li>
                            <li>
                                <Link href="/mediguide" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    MediGuide
                                </Link>
                            </li>
                            <li>
                                <Link href="/pillbot" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    PillBot
                                </Link>
                            </li>
                            <li>
                                <Link href="/medispot" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    MediSpot
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Connect With Us</h4>
                        <div className="flex space-x-4">
                            <Link
                                href="https://github.com/divi-24/"
                                target="_blank"
                                rel="noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Github className="h-5 w-5" />
                            </Link>
                            <Link
                                href="https://x.com/divi_2405/"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link
                                href="https://www.linkedin.com/in/deepakgupta249/"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} PillPal. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
