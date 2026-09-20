import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | Sweet Maid Cleaning Service',
  description: 'The page you are looking for does not exist or has been moved. Explore our professional house cleaning and maid services across Florida.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 text-pink-500 rounded-full mb-6 shadow-sm">
          <span className="text-3xl font-black">404</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Page Not Found
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          The link you followed may be broken or the page may have been moved to a new address.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
          >
            Return to Homepage
          </Link>
          <Link
            href="/locations/"
            className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-white border border-gray-200 hover:border-pink-300 text-gray-800 font-semibold text-sm sm:text-base shadow-sm hover:shadow transition-all"
          >
            Browse All Locations
          </Link>
        </div>

        <div className="pt-8 border-t border-gray-100 text-left">
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-4 text-center">
            Popular Cleaning Services
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-sm">
            <Link href="/house-cleaning/" className="p-2 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-medium transition">
              House Cleaning
            </Link>
            <Link href="/deep-cleaning/" className="p-2 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-medium transition">
              Deep Cleaning
            </Link>
            <Link href="/move-in-out-cleaning/" className="p-2 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-medium transition">
              Move In / Out
            </Link>
            <Link href="/commercial-cleaning/" className="p-2 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-medium transition">
              Commercial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
