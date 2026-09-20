import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sweet Maid Cleaning Services',
  description: 'Learn how Sweet Maid Cleaning Service collects, uses, and safeguards your personal data, booking information, and online privacy.',
  alternates: {
    canonical: 'https://sweetmaidcleaning.com/privacy-policy/',
  },
  openGraph: {
    title: 'Privacy Policy | Sweet Maid Cleaning Services',
    description: 'Privacy Policy and data practices of Sweet Maid Cleaning Service in Florida.',
    url: 'https://sweetmaidcleaning.com/privacy-policy/',
    type: 'website',
  }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fffafc] text-gray-800 font-sans">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-pink-300 via-pink-200 to-pink-300 text-gray-800 text-xs py-2.5 text-center font-semibold tracking-wide px-4">
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
          <span>
            <i className="fa-solid fa-shield-halved text-pink-600 mr-1"></i> Transparent & Secure Data Protection
          </span>
          <span className="hidden sm:inline">|</span>
          <span>
            <i className="fa-solid fa-phone mr-1"></i> Call Support: (941) 222-2080 / (305) 851-6959
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">
            <Link href="/" className="flex items-center group">
              <img
                src="/images/logo.png"
                alt="Sweet Maid Cleaning Service"
                className="h-16 md:h-20 w-auto object-contain group-hover:scale-105 transition-transform"
                width="200"
                height="80"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
              <Link href="/" className="hover:text-pink-500 transition-colors">Home</Link>
              <Link href="/about/" className="hover:text-pink-500 transition-colors">About Us</Link>
              <Link href="/house-cleaning/" className="hover:text-pink-500 transition-colors">Services</Link>
              <Link href="/locations/" className="hover:text-pink-500 transition-colors">Locations</Link>
              <Link href="/blog/" className="hover:text-pink-500 transition-colors">Blog</Link>
              <Link href="/gallery/" className="hover:text-pink-500 transition-colors">Gallery</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link
                href="/book-online/"
                className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all text-sm"
              >
                Book Online
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-pink-50 to-white py-14 border-b border-pink-100/60">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 text-xs font-bold px-3.5 py-1.5 rounded-full mb-4">
            <i className="fa-solid fa-lock"></i>
            <span>Privacy & Security</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 font-serif mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Last Updated: January 2026. Your privacy and trust are paramount to Sweet Maid Cleaning Service.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 leading-relaxed text-gray-700 text-sm md:text-base">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xs border border-pink-100/80 space-y-8">
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">1. Introduction</h2>
            <p>
              Sweet Maid Cleaning Service (&quot;Sweet Maid,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to respecting and protecting the privacy of our customers, website visitors, and users. This Privacy Policy outlines our practices concerning the collection, use, maintenance, and disclosure of personal information collected through <Link href="/" className="text-pink-600 hover:underline">sweetmaidcleaning.com</Link> and associated booking portals.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect several types of information to provide seamless, high-quality cleaning and maid services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contact Details:</strong> Name, phone number, email address, physical service address, and gate/entry instructions.</li>
              <li><strong>Service Preferences:</strong> Property size, number of bedrooms/bathrooms, frequency of service, pet information, and special cleaning instructions.</li>
              <li><strong>Billing & Payment Information:</strong> Payment transactions are securely processed through PCI-DSS compliant third-party payment gateways (e.g., Stripe). Sweet Maid never stores full credit card numbers on our local servers.</li>
              <li><strong>Usage & Device Data:</strong> IP address, browser type, operating system, referring URLs, and website activity collected automatically via analytics cookies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We utilize the information we collect for the following legitimate business purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To schedule, dispatch, manage, and complete your residential or commercial cleaning appointments.</li>
              <li>To provide instant pricing quotes and process payments or invoices.</li>
              <li>To send booking confirmations, appointment reminders, arrival notifications, and service satisfaction check-ins via SMS or email.</li>
              <li>To respond to customer service inquiries, claims, or feedback.</li>
              <li>To optimize website performance, improve user experience, and detect security vulnerabilities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">4. SMS & Text Messaging Policy (TCPA Compliance)</h2>
            <p className="mb-3">
              By providing your telephone number through our booking forms, quote requests, or website, you consent to receive transactional notifications and appointment updates via SMS/text messaging from Sweet Maid Cleaning Service.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Message frequency varies according to your service schedule.</li>
              <li>Standard message and data rates may apply.</li>
              <li>You may opt out of SMS communications at any time by replying <strong>STOP</strong> to any message, or text <strong>HELP</strong> for assistance.</li>
              <li>We strictly do not share, sell, or rent your mobile phone number to third parties or affiliates for marketing or promotional purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">5. Data Sharing & Third Parties</h2>
            <p>
              We do not sell, trade, or rent your personal data to third parties. We may disclose personal data to trusted service providers (such as dispatch software, secure payment processors, and SMS gateways) solely to fulfill our services to you, or when required by law to comply with legal proceedings, court orders, or law enforcement requests.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">6. Cookies & Tracking Technologies</h2>
            <p>
              Our website uses cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can adjust your browser settings to decline cookies, though certain features of our booking platform may not function optimally without them.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">7. Data Security</h2>
            <p>
              We implement industry-standard administrative, technical, and physical security measures (including SSL encryption and access controls) to safeguard your personal data from unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">8. Your Privacy Rights</h2>
            <p>
              Depending on your location, including under Florida law, you have the right to access, correct, or request deletion of your personal information held by Sweet Maid. To exercise these rights, please contact us using the details provided below.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">9. Contact Us</h2>
            <p className="mb-3">If you have any questions, concerns, or requests regarding this Privacy Policy, please contact our team:</p>
            <div className="bg-pink-50/60 p-5 rounded-2xl border border-pink-100 text-sm space-y-1.5">
              <p><strong>Sweet Maid Cleaning Service</strong></p>
              <p>Email: <a href="mailto:info@sweetmaidcleaning.com" className="text-pink-600 hover:underline">info@sweetmaidcleaning.com</a></p>
              <p>Bradenton / Manatee Dispatch: <a href="tel:19412222080" className="text-pink-600 hover:underline">(941) 222-2080</a></p>
              <p>Florida Keys / Monroe Dispatch: <a href="tel:13058516959" className="text-pink-600 hover:underline">(305) 851-6959</a></p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-100 py-12 px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Sweet Maid" className="h-12 w-auto object-contain" />
            <div>
              <div className="font-serif font-bold text-gray-900">Sweet Maid Cleaning Service</div>
              <div className="text-xs text-gray-500">Florida's #1 Premier Cleaning Team</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-gray-600">
            <Link href="/" className="hover:text-pink-500 transition-colors">Home</Link>
            <Link href="/about/" className="hover:text-pink-500 transition-colors">About Us</Link>
            <Link href="/house-cleaning/" className="hover:text-pink-500 transition-colors">Services</Link>
            <Link href="/locations/" className="hover:text-pink-500 transition-colors">Locations</Link>
            <Link href="/privacy-policy/" className="text-pink-600 font-bold transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions/" className="hover:text-pink-500 transition-colors">Terms &amp; Conditions</Link>
            <Link href="/sitemap.xml" className="hover:text-pink-500 transition-colors">Sitemap</Link>
          </div>
          <div className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Sweet Maid Cleaning Service. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
