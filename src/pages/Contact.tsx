import { Mail, MessageCircle, Bug, Lightbulb } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { SEO_DATA } from '../utils/seo';

export function Contact() {
  const seo = useSEO({
    title: SEO_DATA.contact.title,
    description: SEO_DATA.contact.description,
    keywords: SEO_DATA.contact.keywords,
    canonicalPath: '/contact',
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {seo}

      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="text-lg text-text-secondary mb-8">
        Have questions, feedback, or need help? We'd love to hear from you! Choose the best way to reach out below.
      </p>

      {/* Contact Methods */}
      <div className="mb-12 max-w-2xl mx-auto">
        {/* Email Support */}
        <div className="bg-surface rounded-xl border-2 border-border p-8 hover:border-primary transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary p-3 rounded-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Email Support</h2>
          </div>
          <p className="text-text-secondary mb-4">
            For general inquiries, support questions, or bug reports, email us at:
          </p>
          <a
            href="mailto:mighty.pro.dev@gmail.com"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all active:scale-95"
          >
            mighty.pro.dev@gmail.com
          </a>
          <p className="text-sm text-text-secondary mt-4">
            We typically respond within 24-48 hours during business days.
          </p>
        </div>
      </div>

      {/* What to Contact Us About */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">What Can We Help With?</h2>
        <div className="space-y-4">
          {/* Bug Reports */}
          <div className="bg-surface rounded-lg border border-border p-5">
            <div className="flex items-start gap-3">
              <Bug className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Bug Reports</h3>
                <p className="text-text-secondary text-sm mb-3">
                  Found a bug or something not working correctly? Let us know! Please include:
                </p>
                <ul className="text-text-secondary text-sm space-y-1 ml-4">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Which feature/page has the issue</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Steps to reproduce the problem</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Your device and browser (e.g., "iPhone 14 with Safari")</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Screenshots if possible</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature Requests */}
          <div className="bg-surface rounded-lg border border-border p-5">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Feature Requests</h3>
                <p className="text-text-secondary text-sm mb-3">
                  Have an idea for a new feature or improvement? We love hearing suggestions! Tell us:
                </p>
                <ul className="text-text-secondary text-sm space-y-1 ml-4">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>What feature you'd like to see</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>How it would improve your gaming experience</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Any specific games or scenarios where it would be useful</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* General Feedback */}
          <div className="bg-surface rounded-lg border border-border p-5">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">General Feedback</h3>
                <p className="text-text-secondary text-sm">
                  We appreciate all feedback! Whether it's praise, criticism, or suggestions for improvement, your input helps make PlayFlow better for everyone. Share your experience with us!
                </p>
              </div>
            </div>
          </div>

          {/* Technical Support */}
          <div className="bg-surface rounded-lg border border-border p-5">
            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Technical Support</h3>
                <p className="text-text-secondary text-sm">
                  Having trouble installing PlayFlow or getting a feature to work? Contact us with details about your device, browser, and the issue you're experiencing. Check our How to Use guide first - it might have the answer!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Response Time */}
      <div className="bg-primary/10 rounded-xl border-2 border-primary/20 p-6 mb-8">
        <h2 className="text-xl font-bold mb-3">Response Time</h2>
        <p className="text-text-secondary text-sm leading-relaxed">
          We aim to respond to all inquiries within <strong>24-48 hours</strong> during business days (Monday-Friday). Complex technical issues may take longer to investigate and resolve. We appreciate your patience!
        </p>
      </div>

      {/* Privacy Note */}
      <div className="bg-surface rounded-lg border border-border p-5">
        <h3 className="font-semibold mb-2">Privacy Note</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          When you contact us, we'll use your email address solely to respond to your inquiry. We don't add you to mailing lists or share your information with third parties. For more details, see our Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default Contact;
