import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { SEO_DATA } from '../utils/seo';

export function Terms() {
  const seo = useSEO({
    title: SEO_DATA.terms.title,
    description: SEO_DATA.terms.description,
    keywords: SEO_DATA.terms.keywords,
    canonicalPath: '/terms',
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {seo}

      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <p className="text-text-secondary mb-8">
        <strong>Effective Date:</strong> January 1, 2026
        <br />
        <strong>Last Updated:</strong> June 5, 2026
      </p>

      <div className="prose prose-lg max-w-none">
        {/* Introduction */}
        <div className="mb-8">
          <p className="text-text-secondary leading-relaxed mb-4">
            Welcome to PlayFlow! These Terms of Service ("Terms") govern your use of the PlayFlow board game companion app available at playflow.in ("Service", "App", "PlayFlow"). By accessing or using PlayFlow, you agree to be bound by these Terms.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Please read these Terms carefully. If you do not agree with any part of these Terms, you should not use PlayFlow.
          </p>
        </div>

        {/* Service Description */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Service Description
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            PlayFlow is a free, offline-first Progressive Web App (PWA) that provides board game utility tools including:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4 ml-4">
            <li>Who Goes First (random player selection)</li>
            <li>Team Builder (team creation and balancing)</li>
            <li>Turn Order Tracker</li>
            <li>Score Tracker</li>
            <li>Arena Mode (tournament tracking)</li>
            <li>Multi-Clock Timer</li>
            <li>Dice Roller</li>
            <li>Spin Wheel</li>
            <li>Coin Flip</li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            The Service is provided free of charge and is supported by advertising through Google AdSense.
          </p>
        </section>

        {/* Acceptance of Terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            By using PlayFlow, you acknowledge that you have read, understood, and agree to be bound by these Terms and our{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            . If you are using PlayFlow on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
          </p>
        </section>

        {/* Free Service Disclaimer */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Free Service and No Warranty</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            PlayFlow is provided free of charge on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied, regarding:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4 ml-4">
            <li>The accuracy, reliability, or availability of the Service</li>
            <li>That the Service will be uninterrupted, secure, or error-free</li>
            <li>That defects will be corrected</li>
            <li>That the Service is free from viruses or other harmful components</li>
            <li>The results obtained from using the Service</li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            PlayFlow is designed for entertainment and convenience. While we strive for accuracy in our random number generation and calculations, we do not guarantee that the tools will be suitable for any particular purpose, including competitive or professional gaming use.
          </p>
        </section>

        {/* User Responsibilities */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">User Responsibilities and Acceptable Use</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            When using PlayFlow, you agree to:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4 ml-4">
            <li>Use the Service only for lawful purposes</li>
            <li>Not attempt to interfere with, disrupt, or harm the Service</li>
            <li>Not attempt to reverse engineer, decompile, or extract source code</li>
            <li>Not use automated tools (bots, scrapers) to access the Service</li>
            <li>Not remove, obscure, or alter any proprietary notices or branding</li>
            <li>Comply with all applicable local, state, national, and international laws</li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            We reserve the right to suspend or terminate access to PlayFlow for any user who violates these Terms or engages in conduct that we deem harmful to the Service or other users.
          </p>
        </section>

        {/* Intellectual Property */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Intellectual Property Rights</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            PlayFlow, including its original content, features, functionality, design, and branding, is owned by PlayFlow and is protected by international copyright, trademark, and other intellectual property laws.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            You may use PlayFlow for personal, non-commercial purposes. You may not:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4 ml-4">
            <li>Copy, modify, or create derivative works based on PlayFlow</li>
            <li>Distribute, sell, lease, or sublicense the Service</li>
            <li>Use PlayFlow branding or logos without express permission</li>
            <li>Frame or mirror any part of the Service without authorization</li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            PlayFlow is open to community contributions. If you have suggestions or would like to contribute, please visit our{' '}
            <Link to="/contact" className="text-primary hover:underline">
              Contact page
            </Link>
            .
          </p>
        </section>

        {/* User Data and Privacy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">User Data and Privacy</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            PlayFlow uses local storage on your device to save game data, preferences, and settings. This data remains on your device and is not transmitted to our servers. For detailed information about data handling, please review our{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
          <p className="text-text-secondary leading-relaxed">
            You are responsible for maintaining the security of your device and any data stored locally by PlayFlow. We are not responsible for data loss due to device failure, browser data clearing, app uninstallation, or any other cause.
          </p>
        </section>

        {/* Advertising */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Advertising</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            PlayFlow displays advertisements through Google AdSense to support the free Service. By using PlayFlow, you acknowledge and accept that:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4 ml-4">
            <li>Advertisements are provided by third parties (primarily Google AdSense)</li>
            <li>We do not control the content of advertisements displayed</li>
            <li>Clicking on advertisements may redirect you to external websites</li>
            <li>We are not responsible for the content, products, or services advertised by third parties</li>
            <li>Third-party advertisers may use cookies and tracking technologies as described in our Privacy Policy</li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            You interact with advertisements at your own risk. We recommend exercising caution and good judgment when clicking on ads or engaging with advertised products and services.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            To the fullest extent permitted by law, PlayFlow and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4 ml-4">
            <li>Loss of data or game progress</li>
            <li>Loss of profits or opportunities</li>
            <li>Service interruptions or errors</li>
            <li>Damages arising from reliance on the Service</li>
            <li>Any other damages related to your use or inability to use PlayFlow</li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability for incidental or consequential damages. In such jurisdictions, our liability shall be limited to the maximum extent permitted by law.
          </p>
        </section>

        {/* Indemnification */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Indemnification</h2>
          <p className="text-text-secondary leading-relaxed">
            You agree to indemnify, defend, and hold harmless PlayFlow and its operators from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorney fees) arising out of or related to your use of the Service, your violation of these Terms, or your violation of any rights of another party.
          </p>
        </section>

        {/* Changes to Service */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Changes to the Service</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            We reserve the right to modify, suspend, or discontinue PlayFlow (or any part thereof) at any time, with or without notice, for any reason. We may add new features, remove existing features, or change how features work.
          </p>
          <p className="text-text-secondary leading-relaxed">
            We will not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Changes to Terms of Service</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            We may update these Terms from time to time to reflect changes in our practices, legal requirements, or Service features. When we make significant changes, we will update the "Last Updated" date and may display a notification in the app.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Your continued use of PlayFlow after changes to these Terms constitutes your acceptance of the revised Terms. If you do not agree to the modified Terms, you should discontinue using the Service.
          </p>
        </section>

        {/* Governing Law */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Governing Law and Disputes</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Any disputes arising from or relating to these Terms or your use of PlayFlow shall be resolved through good faith negotiations. If negotiations fail, disputes shall be subject to the exclusive jurisdiction of the courts located in India.
          </p>
        </section>

        {/* Severability */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Severability</h2>
          <p className="text-text-secondary leading-relaxed">
            If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect and enforceable.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            If you have questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-surface rounded-lg border border-border p-4">
            <p className="text-text-secondary mb-2">
              <strong>Email:</strong>{' '}
              <a href="mailto:mighty.pro.dev@gmail.com" className="text-primary hover:underline">
                mighty.pro.dev@gmail.com
              </a>
            </p>
            <p className="text-text-secondary">
              <strong>Contact Page:</strong>{' '}
              <Link to="/contact" className="text-primary hover:underline">
                playflow.in/contact
              </Link>
            </p>
          </div>
        </section>

        {/* Acknowledgment */}
        <div className="bg-primary/10 rounded-xl border-2 border-primary/20 p-6 mt-8">
          <h2 className="text-xl font-bold mb-3">Acknowledgment</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            By using PlayFlow, you acknowledge that you have read these Terms of Service, understand them, and agree to be bound by them. Thank you for using PlayFlow, and we hope you enjoy enhancing your board game experiences with our tools!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Terms;
