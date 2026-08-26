import { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Book Online | Instant House Cleaning & Maid Service Booking | Sweet Maid',
  description: 'Book your house cleaning, deep cleaning, or maid service online in under 60 seconds with Sweet Maid. Transparent flat-rate pricing, vetted cleaners, 100% satisfaction guaranteed.',
  alternates: {
    canonical: 'https://sweetmaidcleaning.com/book-online/',
  },
  openGraph: {
    title: 'Book Online | Sweet Maid Cleaning Services',
    description: 'Instant online booking for top-rated house cleaning and maid services across Florida.',
    url: 'https://sweetmaidcleaning.com/book-online/',
    type: 'website',
    images: ['https://i.ibb.co/QSD3Ydt/image.jpg']
  }
};

export default function BookOnlinePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fffafc] text-[#2d1b2e] font-sans">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-pink-300 via-pink-200 to-pink-300 text-gray-800 text-xs py-2.5 text-center font-semibold tracking-wide px-4">
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
          <span>
            <i className="fa-solid fa-sparkles text-pink-600 mr-1"></i> Instant Online Booking & Flat-Rate Pricing
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
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <img
                src="/images/logo.png"
                alt="Sweet Maid Cleaning Service"
                className="h-16 md:h-20 w-auto object-contain group-hover:scale-105 transition-transform"
                width="200"
                height="80"
              />
            </Link>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-pink-400 transition-colors">
                Home
              </Link>
              <Link href="/about/" className="text-sm font-semibold text-gray-700 hover:text-pink-400 transition-colors">
                About Us
              </Link>
              <Link href="/house-cleaning/" className="text-sm font-semibold text-gray-700 hover:text-pink-400 transition-colors">
                Services
              </Link>
              <Link href="/locations/" className="text-sm font-semibold text-gray-700 hover:text-pink-400 transition-colors">
                Locations
              </Link>
              <Link href="/blog/" className="text-sm font-semibold text-gray-700 hover:text-pink-400 transition-colors">
                Blogs
              </Link>
              <Link href="/gallery/" className="text-sm font-semibold text-gray-700 hover:text-pink-400 transition-colors">
                Gallery
              </Link>
              <Link href="/book-online/" className="text-sm font-bold text-pink-500 border-b-2 border-pink-400 transition-colors">
                Book Online
              </Link>
              <Link href="/login/" className="text-sm font-semibold text-gray-700 hover:text-pink-400 transition-colors">
                Login
              </Link>
            </nav>

            {/* Header Call CTA */}
            <div className="flex items-center gap-3">
              <a
                href="tel:19412222080"
                className="hidden sm:flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-600 px-5 py-2.5 rounded-full font-bold text-sm transition-all border border-pink-200"
              >
                <i className="fa-solid fa-phone"></i> (941) 222-2080
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Booking Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 border border-pink-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <i className="fa-solid fa-calendar-check"></i> Real-Time Availability
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 font-serif leading-tight mb-4">
            Book Your Cleaning Online in Seconds
          </h1>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Select your service type, customize your cleaning checklist, and pick your preferred arrival date and time. Flat-rate pricing with 100% Sparkle Guarantee.
          </p>
        </div>

        {/* Embedded BookingKoala Widget */}
        <div className="bg-white rounded-3xl shadow-xl border border-pink-100/80 overflow-hidden p-2 sm:p-4 md:p-6 mb-12">
          <iframe
            src="https://sweetmaidcleaningservice.bookingkoala.com/booknow?embed=true"
            style={{ border: 'none', minHeight: '1000px', width: '100%' }}
            width="100%"
            height="1000"
            scrolling="no"
            title="Sweet Maid Online Booking Widget"
            className="w-full rounded-2xl"
          />
          <Script
            src="https://sweetmaidcleaningservice.bookingkoala.com/resources/embed.js"
            strategy="lazyOnload"
          />
        </div>

        {/* Booking Benefits & Guarantees */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm text-center">
            <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              <i className="fa-solid fa-shield-heart"></i>
            </div>
            <h2 className="font-bold text-gray-900 text-base mb-1">100% Insured & Bonded</h2>
            <p className="text-gray-500 text-xs leading-relaxed">Your property and valuables are fully protected with multi-million dollar coverage.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm text-center">
            <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              <i className="fa-solid fa-user-check"></i>
            </div>
            <h2 className="font-bold text-gray-900 text-base mb-1">Vetted Professionals</h2>
            <p className="text-gray-500 text-xs leading-relaxed">Rigorous background checks and multi-step training for every cleaning specialist.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm text-center">
            <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              <i className="fa-solid fa-leaf"></i>
            </div>
            <h2 className="font-bold text-gray-900 text-base mb-1">Eco & Pet-Friendly</h2>
            <p className="text-gray-500 text-xs leading-relaxed">Non-toxic, hospital-grade cleaning formulas safe for babies, kids, and pets.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm text-center">
            <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              <i className="fa-solid fa-award"></i>
            </div>
            <h2 className="font-bold text-gray-900 text-base mb-1">Sparkle Guarantee</h2>
            <p className="text-gray-500 text-xs leading-relaxed">If anything is missed, we return within 24 hours to re-clean it free of charge.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-100 pt-12 pb-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
          <div className="space-y-4">
            <img src="/images/logo.png" alt="Sweet Maid" className="h-16 w-auto object-contain" width="160" height="64" />
            <p className="text-gray-500 text-xs leading-relaxed">
              Florida's premier residential and commercial cleaning company. Delivering 5-star sparkle and hospital-grade sanitization.
            </p>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-sm mb-4">Quick Links</h2>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link href="/" className="hover:text-pink-400">Home</Link></li>
              <li><Link href="/about/" className="hover:text-pink-400">About Us</Link></li>
              <li><Link href="/book-online/" className="hover:text-pink-400 font-bold text-pink-500">Book Online</Link></li>
              <li><Link href="/locations/" className="hover:text-pink-400">All Florida Locations</Link></li>
              <li><Link href="/login/" className="hover:text-pink-400">Customer Login</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-sm mb-4">Popular Services</h2>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link href="/house-cleaning/" className="hover:text-pink-400">House Cleaning</Link></li>
              <li><Link href="/deep-cleaning/" className="hover:text-pink-400">Deep Cleaning</Link></li>
              <li><Link href="/move-in-out-cleaning/" className="hover:text-pink-400">Move-In/Out Cleaning</Link></li>
              <li><Link href="/airbnb-cleaning/" className="hover:text-pink-400">Airbnb Cleaning</Link></li>
              <li><Link href="/commercial-cleaning/" className="hover:text-pink-400">Commercial Cleaning</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-sm mb-4">Contact Dispatch</h2>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><i className="fa-solid fa-phone text-pink-400 mr-2"></i> <a href="tel:19412222080" className="hover:text-pink-400">(941) 222-2080</a> (Bradenton/Sarasota/Tampa)</li>
              <li><i className="fa-solid fa-phone text-pink-400 mr-2"></i> <a href="tel:13058516959" className="hover:text-pink-400">(305) 851-6959</a> (Miami/Broward)</li>
              <li><i className="fa-solid fa-envelope text-pink-400 mr-2"></i> info@sweetmaidcleaning.com</li>
              <li><i className="fa-solid fa-shield-check text-pink-400 mr-2"></i> Licensed, Bonded & Insured</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 border-t border-pink-50 text-center text-xs text-gray-400">
          &copy; 2026 Sweet Maid Cleaning Service. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
