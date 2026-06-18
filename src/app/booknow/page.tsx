import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thank You - Sweet Maid Cleaning Service',
  description: 'Thank you for requesting a free quote from Sweet Maid Cleaning Service. We will contact you shortly.',
  alternates: {
    canonical: 'https://sweetmaidcleaning.com/booknow/',
  },
  robots: 'noindex, follow', // Thank you pages should be excluded from search index
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fffafc] via-[#fff5f9] to-[#ffe8f4]">
      {/* Header */}
      <header className="w-full py-4 px-6 border-b border-pink-100/50 bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/images/logo.png"
            alt="Sweet Maid Logo"
            className="h-16 w-auto object-contain"
          />
        </Link>
        <a
          href="tel:19412222080"
          className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-500 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 border border-pink-100"
        >
          <i className="fa-solid fa-phone"></i>
          <span className="hidden sm:inline">(941) 222-2080</span>
          <span className="sm:hidden">Call Us</span>
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-pink-100/50 p-8 md:p-12 text-center relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-100/30 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-100/20 rounded-full blur-2xl"></div>

          {/* Success Checkmark Animated */}
          <div className="relative mx-auto w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-8 shadow-inner animate-pulse">
            <svg
              className="w-12 h-12 text-pink-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
            Thank You!
          </h1>
          <p className="text-xl font-semibold text-pink-500 mb-6">
            Your Quote Request Has Been Received
          </p>

          <p className="text-gray-600 mb-8 leading-relaxed">
            We've received your details and our team is already preparing a custom estimate for your home.
            A scheduling coordinator will text or call you within <strong>24 hours</strong> (usually much faster!) to discuss pricing and options.
          </p>

          {/* Next Steps Box */}
          <div className="bg-[#fffafc] rounded-2xl border border-pink-100/50 p-6 mb-8 text-left">
            <h3 className="font-bold text-gray-950 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-list-check text-pink-400"></i> What Happens Next?
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-[10px] font-bold mt-0.5 shrink-0">1</span>
                <span>We'll review your home details and cleaning needs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-[10px] font-bold mt-0.5 shrink-0">2</span>
                <span>We will text or call you to provide your customized free quote.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-[10px] font-bold mt-0.5 shrink-0">3</span>
                <span>You select a preferred date and time, and we handle the rest!</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white rounded-full font-bold shadow-lg hover:shadow-pink-200/50 transition-all duration-300 text-center"
            >
              Back to Home
            </Link>
            <a
              href="tel:19412222080"
              className="px-8 py-4 bg-white border border-pink-200 hover:bg-pink-50 text-pink-500 rounded-full font-bold transition-all duration-300 text-center flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-phone"></i> Call Us Directly
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-pink-100/50 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Sweet Maid Cleaning Service. All rights reserved.
      </footer>
    </div>
  );
}
