export default function AboutPage() {
  return (
    <main className="container py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About PillPal</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p className="text-muted-foreground mb-6">
            PillPal is an innovative healthcare platform that combines artificial intelligence with personalized medication management to enhance your health journey.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            We are dedicated to making healthcare more accessible, personalized, and efficient through cutting-edge technology and user-friendly interfaces.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Vision</h2>
          <p className="text-muted-foreground mb-6">
            To revolutionize healthcare management by providing intelligent, AI-powered solutions that empower individuals to take control of their health.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
          <p className="text-muted-foreground">
            We are a team of healthcare professionals, developers, and AI experts committed to creating innovative solutions for better health outcomes.
          </p>
        </div>
      </div>
    </main>
  )
} 