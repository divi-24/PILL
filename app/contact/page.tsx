export default function ContactPage() {
  return (
    <main className="container py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p className="text-muted-foreground mb-6">
            Have questions or feedback? We did love to hear from you. Reach out to us through any of the following channels:
          </p>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Email</h2>
              <p className="text-muted-foreground">
                support@pillpal.com
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Social Media</h2>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/divi-24/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/deepakgupta249/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Office Hours</h2>
              <p className="text-muted-foreground">
                Monday - Friday: 9:00 AM - 6:00 PM EST
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 