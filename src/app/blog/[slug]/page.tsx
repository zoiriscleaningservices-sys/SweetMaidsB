import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CANONICAL_HOST, BUSINESS_INFO } from '@/config/site-structure';
import { BLOG_POSTS_DATA } from '@/lib/blog_posts_data';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(BLOG_POSTS_DATA).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS_DATA[slug];

  if (!post) {
    return {
      title: 'Guide Not Found | Sweet Maid Cleaning Service',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: post.title,
    description: post.metaDescription,
    alternates: {
      canonical: `${CANONICAL_HOST}/blog/${post.slug}/`,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `${CANONICAL_HOST}/blog/${post.slug}/`,
      type: 'article',
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      authors: ['Leo'],
      images: [`${CANONICAL_HOST}/images/logo.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
      images: [`${CANONICAL_HOST}/images/logo.png`],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS_DATA[slug];

  if (!post) {
    notFound();
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${CANONICAL_HOST}/blog/${post.slug}/#post`,
        "isPartOf": {
          "@type": "Blog",
          "@id": `${CANONICAL_HOST}/blog/#collection`,
          "name": "Florida Cleaning Tips & Guides",
          "url": `${CANONICAL_HOST}/blog/`
        },
        "headline": post.h1,
        "description": post.metaDescription,
        "mainEntityOfPage": `${CANONICAL_HOST}/blog/${post.slug}/`,
        "datePublished": post.datePublished,
        "dateModified": post.dateModified,
        "author": {
          "@type": "Person",
          "name": "Leo"
        },
        "publisher": {
          "@type": "Organization",
          "name": BUSINESS_INFO.name,
          "url": `${CANONICAL_HOST}/`,
          "logo": `${CANONICAL_HOST}/images/logo.png`
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${CANONICAL_HOST}/blog/${post.slug}/#breadcrumbs`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${CANONICAL_HOST}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `${CANONICAL_HOST}/blog/`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.h1,
            "item": `${CANONICAL_HOST}/blog/${post.slug}/`
          }
        ]
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
              <img src="/images/logo.webp" alt="Sweet Maid Cleaning Service" className="h-14 w-auto object-contain" width={200} height={60} decoding="async" />
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

        {/* Breadcrumb Bar */}
        <div className="bg-white border-b border-pink-100/60 py-3">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-xs text-gray-500 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-pink-600 transition">Home</Link>
            <span>/</span>
            <Link href="/blog/" className="hover:text-pink-600 transition">Blog</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate max-w-xs">{post.region}</span>
          </div>
        </div>

        {/* Article Header */}
        <header className="pt-12 pb-8 bg-gradient-to-b from-pink-50/60 via-white to-slate-50 border-b border-pink-100/60">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
              <span className="font-bold text-pink-700 bg-pink-100/80 px-3 py-1 rounded-full border border-pink-200">
                {post.region}
              </span>
              <span>{post.readingTime}</span>
              <span>•</span>
              <span>Published {post.datePublished}</span>
              <span>•</span>
              <span className="font-medium text-gray-700">By Leo (Sweet Maid)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 font-serif leading-tight mb-4">
              {post.h1}
            </h1>
          </div>
        </header>

        {/* Article Body */}
        <article className="py-12 bg-white flex-1 border-b border-pink-100/60">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div
              className="blog-content prose prose-pink max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            {/* Author Attribution Box */}
            <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-pink-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xl shrink-0">
                L
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">Written by Leo</div>
                <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                  Founder at Sweet Maid Cleaning Service. Family-owned and dedicated to delivering professional residential, commercial, and vacation rental cleaning across Florida communities.
                </p>
              </div>
            </div>

            {/* Back to Blog + CTA */}
            <div className="mt-12 pt-8 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/blog/"
                className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-arrow-left text-[10px]"></i> Back to All Florida Guides
              </Link>
              <Link
                href="/book-online/"
                className="px-6 py-2.5 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white rounded-full font-bold text-xs shadow-sm transition"
              >
                Request a Free Cleaning Estimate
              </Link>
            </div>
          </div>
        </article>

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
