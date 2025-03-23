import Link from "next/link";

export default function TermsAndPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">📄 Terms of Service & Privacy Policy</h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Eligibility</h2>
          <p>You must be at least 13 years old to use the Service. By using the Service, you represent and warrant that you meet this requirement.</p>

          <h2 className="text-2xl font-semibold">2. Account Registration</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password and for all activities that occur under your account.</p>

          <h2 className="text-2xl font-semibold">3. Subscriptions & Payments</h2>
          <p>Payments are processed securely through Paddle. By subscribing, you agree to provide accurate payment details and comply with Paddle's terms.</p>

          <h2 className="text-2xl font-semibold">4. Refund Policy</h2>
          <p>We do not offer refunds for digital services once activated unless required by law.</p>

          <h2 className="text-2xl font-semibold">5. User Conduct</h2>
          <p>You agree not to use the Service for unlawful purposes, upload malicious files, or interfere with other users or the system.</p>

          <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
          <p>All content and services are our property and may not be copied or used without permission.</p>

          <h2 className="text-2xl font-semibold">7. Termination</h2>
          <p>We may suspend or terminate your access to the Service if you violate these terms.</p>

          <h2 className="text-2xl font-semibold">8. Disclaimer</h2>
          <p>The Service is provided "as is" with no warranties. We do not guarantee uninterrupted or error-free use.</p>

          <h2 className="text-2xl font-semibold">9. Limitation of Liability</h2>
          <p>We are not liable for any indirect or consequential damages arising from your use of the Service.</p>

          <h2 className="text-2xl font-semibold">10. Modifications</h2>
          <p>We may update these Terms at any time. Continued use means you accept the new Terms.</p>

          <h2 className="text-2xl font-semibold">11. Contact</h2>
          <p>If you have questions, contact us at: <strong>support@yourdomain.com</strong></p>
        </section>

        <div className="text-center pt-4">
          <Link href="/" className="text-blue-400 underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
