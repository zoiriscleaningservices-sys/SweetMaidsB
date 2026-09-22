import { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Book House Cleaning Online | Instant Maid Booking | Sweet Maid',
  description: 'Book your house cleaning, deep cleaning, or maid service online in under 60 seconds with Sweet Maid. Transparent flat-rate pricing, vetted cleaners, 100% satisfaction guaranteed.',
  alternates: {
    canonical: 'https://sweetmaidcleaning.com/book-online/',
  },
  openGraph: {
    title: 'Book House Cleaning Online | Instant Maid Booking | Sweet Maid',
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
            <i className="fa-solid fa-sparkles text-pink-600 mr-1"></i> Instant Online Booking &amp; Flat-Rate Pricing
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

            {/* Navigation Links - Desktop */}
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

            {/* Header Call CTA & Mobile Toggle */}
            <div className="flex items-center gap-3">
              <a
                href="tel:19412222080"
                className="hidden sm:flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-600 px-5 py-2.5 rounded-full font-bold text-sm transition-all border border-pink-200"
              >
                <i className="fa-solid fa-phone"></i> (941) 222-2080
              </a>

              {/* Mobile Hamburger Controls */}
              <div className="flex items-center gap-2 lg:hidden">
                <a
                  href="tel:19412222080"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-50 text-pink-600 border border-pink-200"
                  aria-label="Call Sweet Maid"
                >
                  <i className="fa-solid fa-phone text-sm"></i>
                </a>
                <button
                  id="mobile-btn"
                  aria-label="Open mobile navigation menu"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100 transition-colors"
                >
                  <i className="fa-solid fa-bars text-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div id="mobile-menu" className="fixed inset-0 z-[100] mobile-menu-glass flex flex-col invisible">
        <div className="p-6 flex justify-between items-center border-b border-pink-100 bg-white/50">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Sweet Maid" className="h-10 w-auto" width="120" height="40" />
            <span className="font-serif text-lg font-bold text-gray-900">Sweet Maid</span>
          </div>
          <button
            id="close-mobile"
            aria-label="Close mobile navigation menu"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition-colors"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <nav className="flex flex-col gap-3">
            <Link href="/" className="menu-item flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all font-bold text-gray-800">
              <span>Home</span>
              <i className="fa-solid fa-house text-pink-300"></i>
            </Link>
            <Link href="/about/" className="menu-item flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all font-bold text-gray-800">
              <span>About Us</span>
              <i className="fa-solid fa-circle-info text-pink-300"></i>
            </Link>
            <Link href="/house-cleaning/" className="menu-item flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all font-bold text-gray-800">
              <span>House Cleaning</span>
              <i className="fa-solid fa-sparkles text-pink-300"></i>
            </Link>
            <Link href="/locations/" className="menu-item flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all font-bold text-gray-800">
              <span>Florida Locations</span>
              <i className="fa-solid fa-map-pin text-pink-300"></i>
            </Link>
            <Link href="/blog/" className="menu-item flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all font-bold text-gray-800">
              <span>Cleaning Blogs</span>
              <i className="fa-solid fa-newspaper text-pink-300"></i>
            </Link>
            <Link href="/gallery/" className="menu-item flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all font-bold text-gray-800">
              <span>Before &amp; After Gallery</span>
              <i className="fa-solid fa-images text-pink-300"></i>
            </Link>
            <Link href="/book-online/" className="menu-item flex items-center justify-between p-4 rounded-2xl bg-pink-500 text-white font-bold shadow-md">
              <span>Book Online</span>
              <i className="fa-solid fa-calendar-check"></i>
            </Link>
            <Link href="/login/" className="menu-item flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all font-bold text-gray-800">
              <span>Client Portal Login</span>
              <i className="fa-solid fa-right-to-bracket text-pink-300"></i>
            </Link>
          </nav>
        </div>
      </div>

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

        {/* Booking Card & Embedded Widget */}
        <div className="bg-white rounded-3xl shadow-xl border border-pink-100/80 overflow-hidden p-3 sm:p-6 mb-12">
          {/* Security & Fullscreen Link Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-pink-50/70 border border-pink-100 rounded-2xl px-5 py-3 mb-5 text-xs text-gray-700">
            <div className="flex items-center gap-2 font-medium">
              <i className="fa-solid fa-shield-halved text-teal-600 text-sm"></i>
              <span>256-Bit SSL Encrypted &amp; Instant Confirmation</span>
            </div>
            <a
              href="https://sweetmaidcleaningservice.bookingkoala.com/booknow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-pink-600 hover:text-pink-700 font-bold hover:underline transition-colors"
            >
              <span>Open booking portal in full window</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[11px]"></i>
            </a>
          </div>

          {/* Iframe with dynamic auto-height & fallback scrolling */}
          <div className="w-full relative min-h-[900px] overflow-hidden rounded-2xl bg-gray-50/50">
            <iframe
              id="bookingkoala-iframe"
              src="https://sweetmaidcleaningservice.bookingkoala.com/booknow?embed=true"
              style={{ border: 'none', width: '1px', minWidth: '100%', minHeight: '900px' }}
              width="100%"
              height="900"
              scrolling="auto"
              title="Sweet Maid Online Booking Portal"
              className="w-full rounded-2xl"
            />
          </div>

          <Script
            src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.2/iframeResizer.min.js"
            strategy="afterInteractive"
          />
          <Script id="bookingkoala-resizer-init" strategy="lazyOnload">
            {`
              (function() {
                function initResizer() {
                  if (typeof iFrameResize === 'function') {
                    try {
                      iFrameResize({
                        log: false,
                        checkOrigin: false,
                        heightCalculationMethod: 'lowestElement',
                        tolerance: 10
                      }, '#bookingkoala-iframe');
                    } catch (err) {
                      console.warn('BookingKoala iframe resize note:', err);
                    }
                  } else {
                    setTimeout(initResizer, 150);
                  }
                }
                if (document.readyState === 'complete') {
                  initResizer();
                } else {
                  window.addEventListener('load', initResizer);
                }
              })();
            `}
          </Script>
        </div>

        {/* Dispatch Phone Support Banner */}
        <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="font-bold text-gray-900 text-base mb-1">Prefer to book or customize over the phone?</h3>
            <p className="text-gray-500 text-xs">Our Florida customer service team is standing by to assist with custom schedules, commercial quotes, and instant booking.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:19412222080"
              className="inline-flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-600 font-bold text-xs px-4 py-2.5 rounded-full border border-pink-200 transition-colors"
            >
              <i className="fa-solid fa-phone"></i> (941) 222-2080
            </a>
            <a
              href="tel:13058516959"
              className="inline-flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs px-4 py-2.5 rounded-full border border-teal-200 transition-colors"
            >
              <i className="fa-solid fa-phone"></i> (305) 851-6959
            </a>
          </div>
        </div>

        {/* Booking Benefits & Guarantees */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-pink-50 shadow-sm text-center">
            <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              <i className="fa-solid fa-shield-heart"></i>
            </div>
            <h2 className="font-bold text-gray-900 text-base mb-1">100% Insured &amp; Bonded</h2>
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
            <h2 className="font-bold text-gray-900 text-base mb-1">Eco &amp; Pet-Friendly</h2>
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
              <li><i className="fa-solid fa-phone text-pink-400 mr-2"></i> <a href="tel:19412222080" className="hover:text-pink-400">(941) 222-2080</a> (Bradenton / Manatee County / Sarasota / Tampa)</li>
              <li><i className="fa-solid fa-phone text-pink-400 mr-2"></i> <a href="tel:13058516959" className="hover:text-pink-400">(305) 851-6959</a> (Florida Keys / Monroe County / Miami-Dade / Broward)</li>
              <li><i className="fa-solid fa-envelope text-pink-400 mr-2"></i> info@sweetmaidcleaning.com</li>
              <li><i className="fa-solid fa-shield-check text-pink-400 mr-2"></i> Licensed, Bonded &amp; Insured</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 border-t border-pink-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>&copy; 2026 Sweet Maid Cleaning Service. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy/" className="hover:text-pink-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions/" className="hover:text-pink-500 transition-colors">Terms &amp; Conditions</Link>
            <a href="/sitemap.xml" className="hover:text-pink-500 transition-colors">Sitemap</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
