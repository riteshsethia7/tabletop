import { Link } from 'react-router-dom';
import { Shield, Database, Cookie, Lock } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { SEO_DATA } from '../utils/seo';

export function Privacy() {
  const seo = useSEO({
    title: SEO_DATA.privacy.title,
    description: SEO_DATA.privacy.description,
    keywords: SEO_DATA.privacy.keywords,
    canonicalPath: '/privacy',
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {seo}

      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-text-secondary mb-8">
        <strong>Effective Date:</strong> January 1, 2026
        <br />
        <strong>Last Updated:</strong> June 5, 2026
      </p>

      <div className="prose prose-lg max-w-none">
        {/* Introduction */}
        <div className="mb-8">
          <p className="text-text-secondary leading-relaxed mb-4">
            At PlayFlow, we take your privacy seriously. This Privacy Policy explains how we handle your information when you use our board game companion app available at playflow.in. Our commitment is simple: your data stays on your device, period.
          </p>
          <p className="text-text-secondary leading-relaxed">
            PlayFlow is built with a privacy-first, local-first architecture. This means we don't operate servers to collect, store, or process your personal information. Everything you do in PlayFlow happens entirely on your device.
          </p>
        </div>

        {/* Key Privacy Features */}
        <div className="bg-surface rounded-xl border border-border p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Privacy at a Glance
          </h2>
          <ul className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>No user accounts or registration required</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>No servers collecting your data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>All game data stored locally on your device</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>No personal information collected or shared</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Works completely offline</span>
            </li>
          </ul>
        </div>

        {/* Data Collection */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" />
            What Data We Collect (Spoiler: Almost Nothing)
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">Personal Information</h3>
          <p className="text-text-secondary leading-relaxed mb-4">
            We do NOT collect, store, or process any personal information about you. We don't ask for your name, email address, phone number, location, or any other personally identifiable information. PlayFlow works without requiring an account or login.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">Game Data</h3>
          <p className="text-text-secondary leading-relaxed mb-4">
            All game data you create in PlayFlow (scores, team configurations, timer settings, dice roll history, etc.) is stored locally on your device using IndexedDB, a browser-based storage technology. This data never leaves your device and is not transmitted to any server. You have complete control over this data and can clear it at any time through your browser settings.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">Technical Information</h3>
          <p className="text-text-secondary leading-relaxed mb-4">
            Like most websites, we collect basic technical information through Google AdSense (see "Advertising" section below). This may include your IP address, browser type, device type, and pages visited. This information is collected by Google, not by us, and is used solely for displaying relevant advertisements and detecting fraud.
          </p>
        </section>

        {/* Local Storage */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary" />
            How We Store Your Data Locally
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            PlayFlow uses the following browser storage technologies to save your preferences and game data on your device:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4 ml-4">
            <li>
              <strong>IndexedDB:</strong> Stores your game data including scores, team configurations, arena match histories, and timer settings. This is persistent storage that remains even after you close the browser.
            </li>
            <li>
              <strong>LocalStorage:</strong> Stores app preferences like theme settings (dark/light mode) and feature preferences.
            </li>
            <li>
              <strong>Service Worker Cache:</strong> Caches the app files so PlayFlow works offline. This does not store your personal data.
            </li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            You can clear this data at any time through your browser settings. On most browsers, this is found under Settings → Privacy → Clear browsing data. Note that clearing this data will reset your scores, teams, and app preferences.
          </p>
        </section>

        {/* Advertising */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Cookie className="w-6 h-6 text-primary" />
            Advertising and Cookies
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            PlayFlow is supported by advertisements served through Google AdSense. While we don't collect your data, Google AdSense does use cookies and similar technologies to display relevant advertisements.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">Google AdSense</h3>
          <p className="text-text-secondary leading-relaxed mb-4">
            Google AdSense may collect and use information such as:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4 ml-4">
            <li>Your IP address and general location (city/country level)</li>
            <li>Browser type and device information</li>
            <li>Pages you visit on PlayFlow</li>
            <li>Your interaction with advertisements</li>
            <li>Cookies to remember your ad preferences</li>
          </ul>
          <p className="text-text-secondary leading-relaxed mb-4">
            Google uses this information to show you relevant ads based on your interests and previous browsing activity across the web. This is called "interest-based advertising" or "personalized advertising."
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            You can control personalized advertising by visiting{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google's Ad Settings
            </a>{' '}
            or opt out of personalized advertising by visiting{' '}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              www.aboutads.info
            </a>
            . You can also use browser extensions or settings to block third-party cookies.
          </p>
          <p className="text-text-secondary leading-relaxed">
            For more information about how Google uses data, please review{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google's Privacy Policy
            </a>
            .
          </p>
        </section>

        {/* Third-Party Services */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Currently, the only third-party service we use is Google AdSense for displaying advertisements. We do not integrate with analytics services, social media platforms, or any other third-party tracking tools.
          </p>
          <p className="text-text-secondary leading-relaxed">
            If we add any third-party services in the future, we will update this Privacy Policy and notify users appropriately.
          </p>
        </section>

        {/* User Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Rights and Controls</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Because we don't collect personal data in our own systems, there's no data for us to access, modify, or delete on our end. However, you have complete control over the data stored on your device:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4 ml-4">
            <li>
              <strong>Access:</strong> All your data is accessible through the PlayFlow interface on your device.
            </li>
            <li>
              <strong>Modify:</strong> You can edit or update your game data, team names, scores, etc., at any time within the app.
            </li>
            <li>
              <strong>Delete:</strong> Clear your browser's site data or uninstall the PWA to completely remove all PlayFlow data from your device.
            </li>
            <li>
              <strong>Export:</strong> Currently, there's no export feature, but since data is stored locally, you maintain full ownership.
            </li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            For Google AdSense data controls, please visit Google's Privacy Controls or your browser's privacy settings.
          </p>
        </section>

        {/* Children's Privacy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            PlayFlow is a family-friendly app suitable for users of all ages. We do not knowingly collect personal information from anyone, including children under 13. Since we don't require account registration or collect personal data, there's no age verification process.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Parents and guardians should be aware that Google AdSense may display advertisements. While we request family-safe ads, we cannot control all ad content. We recommend parental supervision for young children using the app.
          </p>
        </section>

        {/* Security */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Security</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            Since your data never leaves your device, the security of your data is primarily in your hands. We recommend:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4 ml-4">
            <li>Using a secure device with updated software</li>
            <li>Using a password or biometric lock on your device</li>
            <li>Being cautious when using PlayFlow on shared or public devices</li>
            <li>Regularly backing up your device if you want to preserve game data</li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            PlayFlow is served over HTTPS to ensure secure transmission of the app code to your browser. Our Progressive Web App architecture minimizes security risks by eliminating server-side data storage.
          </p>
        </section>

        {/* Changes to Privacy Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or app features. When we make significant changes, we will update the "Last Updated" date at the top of this policy and may display a notification in the app.
          </p>
          <p className="text-text-secondary leading-relaxed">
            We encourage you to review this Privacy Policy periodically to stay informed about how we protect your privacy.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us:
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

        {/* Summary */}
        <div className="bg-primary/10 rounded-xl border-2 border-primary/20 p-6 mt-8">
          <h2 className="text-xl font-bold mb-3">Privacy Policy Summary</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            PlayFlow is designed with privacy as a core principle. We don't collect your personal information, don't have servers storing your data, and don't require accounts. Your game data stays on your device. The only third party is Google AdSense for ads, which uses cookies for personalization. You have complete control over your data and can delete it anytime through your browser settings.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
