import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Sweet Maid Cleaning Services',
  description: 'Read the Terms and Conditions for Sweet Maid Cleaning Services, including booking policies, cancellation guidelines, satisfaction guarantees, and service standards in Florida.',
  alternates: {
    canonical: 'https://sweetmaidcleaning.com/terms-and-conditions/',
  },
  openGraph: {
    title: 'Terms & Conditions | Sweet Maid Cleaning Services',
    description: 'Service agreement, booking terms, and satisfaction guarantee policies of Sweet Maid Cleaning Service.',
    url: 'https://sweetmaidcleaning.com/terms-and-conditions/',
    type: 'website',
  }
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fffafc] text-gray-800 font-sans">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-pink-300 via-pink-200 to-pink-300 text-gray-800 text-xs py-2.5 text-center font-semibold tracking-wide px-4">
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
          <span>
            <i className="fa-solid fa-scale-balanced text-pink-600 mr-1"></i> Transparent & Fair Service Agreement
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
                href="/#quote"
                className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all text-sm"
              >
                Get Free Quote
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-pink-50 to-white py-14 border-b border-pink-100/60">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 text-xs font-bold px-3.5 py-1.5 rounded-full mb-4">
            <i className="fa-solid fa-file-contract"></i>
            <span>Customer Agreement</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 font-serif mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Last Updated: January 2026. Please review these terms carefully before booking your cleaning services.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 leading-relaxed text-gray-700 text-sm md:text-base">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xs border border-pink-100/80 space-y-8">
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing our website, booking an appointment online or by phone, or receiving cleaning services from Sweet Maid Cleaning Service (&quot;Sweet Maid,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should discontinue use of our services immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">2. Cleaning Services &amp; Scope of Work</h2>
            <p className="mb-3">
              Sweet Maid provides professional residential and commercial cleaning services across Florida, including standard house cleaning, deep cleaning, move-in/move-out turnover cleanings, post-construction cleanup, and vacation rental turnovers.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Services are performed based on the package selected during online booking or agreed upon with dispatch.</li>
              <li>Cleaners are provided with professional-grade eco-friendly cleaning supplies and HEPA-filtered vacuum equipment.</li>
              <li>For health and safety compliance, our cleaners do not handle biohazards, mold remediation, human/animal bodily fluids, or excessive hoarding conditions unless specifically arranged under certified specialty protocols.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">3. Property Access, Utilities &amp; Safety</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> The customer is responsible for providing timely access to the property (via key, lockbox code, gate code, or being present on-site). If our cleaning crew is unable to enter the premises within 20 minutes of arrival, a lockout fee of up to $50 may apply.</li>
              <li><strong>Utilities:</strong> Running water, electricity, and functional climate control (A/C during Florida warm months) must be active and accessible for the duration of the cleaning service.</li>
              <li><strong>Pets:</strong> Friendly pets are welcome, but we kindly request that nervous or large animals be secured in a designated area to ensure their safety and the safety of our team members.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">4. Pricing &amp; Payments</h2>
            <p className="mb-3">
              Sweet Maid offers upfront flat-rate pricing based on the accurate number of bedrooms, bathrooms, and square footage disclosed during booking.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>If the condition or size of the property upon arrival significantly exceeds the initial booking description, our team will contact you to approve an updated scope or rate before proceeding.</li>
              <li>Payment is processed electronically upon completion of the service using a valid credit or debit card securely authorized at booking.</li>
              <li>Unpaid balances or returned transactions may be subject to a late fee of $25 or interest as permitted under Florida law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">5. Cancellation &amp; Rescheduling Policy</h2>
            <p>
              We understand that schedules change. To accommodate our team members and scheduled routes, we request at least <strong>24 hours advance notice</strong> for any cancellations or rescheduling requests. Cancellations made with less than 24 hours notice may be subject to a $50 late cancellation fee.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">6. 100% Sparkle Satisfaction Guarantee</h2>
            <p>
              Your complete happiness is our priority. If any item within the agreed scope of your cleaning service was not cleaned to your total satisfaction, notify Sweet Maid within <strong>24 hours of service completion</strong>. We will promptly dispatch a supervisor or team member to re-clean the disputed area completely free of charge. Due to the labor-intensive nature of cleaning services, refunds are not issued prior to allowing our team the opportunity to perform a free reclean.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">7. Breakage, Damage &amp; Insurance Claims</h2>
            <p>
              Sweet Maid is fully licensed, bonded, and insured. Our cleaners exercise exceptional care when servicing your home. In the rare event that an item is accidentally damaged or broken:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Notify our office within 24 hours with photos and description of the damage.</li>
              <li>We will review the claim promptly to repair, replace, or submit through our insurance carrier.</li>
              <li>We cannot be held liable for unstable, pre-damaged, improperly hung fixtures, or irreplaceable family heirlooms of sentimental value that were not put away prior to service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">8. Governing Law</h2>
            <p>
              These Terms and Conditions and any dispute arising from your use of our services shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-serif mb-3">9. Contact Information</h2>
            <p className="mb-3">For questions regarding these Terms &amp; Conditions or to manage your booking, please reach out to our Florida support desk:</p>
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
            <Link href="/privacy-policy/" className="hover:text-pink-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions/" className="text-pink-600 font-bold transition-colors">Terms &amp; Conditions</Link>
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
