import { Metadata } from 'next';
import Link from 'next/link';
import { CANONICAL_HOST, BUSINESS_INFO, REGIONS } from '@/config/site-structure';
import { BLOG_POSTS_DATA } from '@/lib/blog_posts_data';

export const metadata: Metadata = {
  title: 'Florida Cleaning Tips & Guides | Sweet Maid Cleaning Service',
  description: 'Expert cleaning guides for Florida homes and businesses. Practical strategies for coastal humidity, seasonal properties, and vacation rental turnovers.',
  alternates: {
    canonical: `${CANONICAL_HOST}/blog/`,
  },
  openGraph: {
    title: 'Florida Cleaning Tips & Guides | Sweet Maid Cleaning Service',
    description: 'Expert cleaning guides for Florida homes and businesses. Practical strategies for coastal humidity, seasonal properties, and vacation rental turnovers.',
    url: `${CANONICAL_HOST}/blog/`,
    type: 'website',
    images: [`${CANONICAL_HOST}/images/logo.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Florida Cleaning Tips & Guides | Sweet Maid Cleaning Service',
    description: 'Expert cleaning guides for Florida homes and businesses. Practical strategies for coastal humidity, seasonal properties, and vacation rental turnovers.',
    images: [`${CANONICAL_HOST}/images/logo.png`],
  },
};

export default function BlogIndexPage() {
  const posts = Object.values(BLOG_POSTS_DATA);
  const readyRegions = Object.values(REGIONS).filter(r => r.ready);

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Blog", "CollectionPage"],
        "@id": `${CANONICAL_HOST}/blog/#collection`,
        "url": `${CANONICAL_HOST}/blog/`,
        "name": "Cleaning Tips and Guides for Florida Homes and Businesses",
        "description": "Expert cleaning guides for Florida homes and businesses covering coastal humidity, seasonal properties, and vacation rental turnovers.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": `${CANONICAL_HOST}/#website`,
          "name": BUSINESS_INFO.name,
          "url": `${CANONICAL_HOST}/`
        },
        "publisher": {
          "@type": "Organization",
          "name": BUSINESS_INFO.name,
          "url": `${CANONICAL_HOST}/`,
          "logo": `${CANONICAL_HOST}/images/logo.png`
        },
        "blogPost": posts.map(post => ({
          "@type": "BlogPosting",
          "@id": `${CANONICAL_HOST}/blog/${post.slug}/#post`,
          "headline": post.h1,
          "url": `${CANONICAL_HOST}/blog/${post.slug}/`,
          "datePublished": post.datePublished,
          "dateModified": post.dateModified,
          "author": {
            "@type": "Person",
            "name": "Leo"
          }
        }))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col font-sans">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img src="/images/logo.png" alt="Sweet Maid" className="h-14 w-auto object-contain" />
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
              <Link href="/" className="hover:text-pink-600 transition">Home</Link>
              <Link href="/services/" className="hover:text-pink-600 transition">Services</Link>
              <Link href="/locations/" className="hover:text-pink-600 transition">Locations</Link>
              <Link href="/about/" className="hover:text-pink-600 transition">About</Link>
              <Link href="/blog/" className="text-pink-600">Blog</Link>
            </nav>

            <div className="flex items-center gap-4">
              <a href="tel:19412222080" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-pink-600 hover:text-pink-700">
                <i className="fa-solid fa-phone"></i> (941) 222-2080
              </a>
              <Link href="/book-online/" className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow-sm transition">
                Get Free Quote
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-16 pb-14 bg-gradient-to-b from-pink-50/70 via-white to-slate-50 text-center px-6 border-b border-pink-100/60">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-pink-100/80 text-pink-800 text-xs font-bold px-4 py-1.5 rounded-full mb-6 shadow-2xs">
              <i className="fa-solid fa-book-open text-pink-500"></i> Florida Cleaning Authority
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-gray-900 font-serif leading-tight mb-4">
              Cleaning Tips and Guides for Florida Homes and Businesses
            </h1>
            <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              Florida living brings unique environmental demands. From persistent subtropical humidity and Gulf sand intrusion to managing seasonal snowbird residences and fast-turnover vacation rentals, our practical guides help Florida property owners maintain healthy, sparkling indoor environments.
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 bg-white border-b border-pink-100/60 flex-1">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-3xl border border-pink-100/80 shadow-xs hover:shadow-md hover:border-pink-300 transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  <div className="p-7 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mb-4">
                      <span className="font-semibold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
                        {post.region}
                      </span>
                      <span>{post.readingTime}</span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 font-serif group-hover:text-pink-600 transition-colors leading-snug mb-3">
                      <Link href={`/blog/${post.slug}/`}>
                        {post.h1}
                      </Link>
                    </h2>

                    <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="pt-4 border-t border-pink-50 flex items-center justify-between text-xs mt-auto">
                      <span className="text-gray-400 font-medium">By Leo • Sweet Maid</span>
                      <Link
                        href={`/blog/${post.slug}/`}
                        className="font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                      >
                        Read Guide <i className="fa-solid fa-arrow-right text-[10px]"></i>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Coverage cross-links */}
            <div className="mt-16 bg-slate-50 rounded-3xl p-8 border border-pink-100 text-center">
              <h3 className="text-lg font-bold text-gray-900 font-serif mb-2">Looking for Professional Cleaning in Your Region?</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-6 max-w-xl mx-auto">
                Explore our regional hub coverage across Florida. From recurring maid services to vacation rental turnovers and deep cleaning resets, our family-owned team is here to help.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {readyRegions.slice(0, 8).map((reg) => (
                  <Link
                    key={reg.slug}
                    href={`/${reg.slug}/`}
                    className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-pink-50 text-gray-700 hover:text-pink-600 border border-pink-100 transition font-medium"
                  >
                    {reg.name}
                  </Link>
                ))}
                <Link
                  href="/locations/"
                  className="text-xs px-3 py-1.5 rounded-full bg-pink-100/70 hover:bg-pink-100 text-pink-700 border border-pink-200 transition font-bold"
                >
                  All Florida Locations →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-gray-400 py-12 text-xs border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>&copy; 2026 Sweet Maid Cleaning Service. All rights reserved.</div>
            <div className="flex gap-4">
              <Link href="/privacy-policy/" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="/terms-and-conditions/" className="hover:text-white transition">Terms & Conditions</Link>
              <Link href="/locations/" className="hover:text-white transition">Locations</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
