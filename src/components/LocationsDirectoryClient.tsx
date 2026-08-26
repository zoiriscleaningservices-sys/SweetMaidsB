'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { LocationDirectoryItem } from '@/lib/data';

interface LocationsDirectoryClientProps {
  locations: LocationDirectoryItem[];
}

// Region definitions based on coordinates or city names
const REGIONS = [
  { id: 'all', label: 'All Florida (799)' },
  { id: 'tampa', label: '🏖️ Tampa Bay & St. Pete' },
  { id: 'miami', label: '🌴 Miami & South Florida' },
  { id: 'orlando', label: '🏰 Orlando & Central FL' },
  { id: 'swfl', label: '☀️ Sarasota, Bradenton & SWFL' },
  { id: 'jax', label: '🌊 Jacksonville & North FL' },
  { id: 'keys', label: '🏝️ Florida Keys' }
];

export default function LocationsDirectoryClient({ locations }: LocationsDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter locations based on Search, Region, and Letter
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      // 1. Search Query Match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = loc.name.toLowerCase().includes(q);
        const matchesSlug = loc.slug.toLowerCase().includes(q);
        if (!matchesName && !matchesSlug) return false;
      }

      // 2. Region Filter Match
      if (selectedRegion !== 'all') {
        const lat = loc.lat;
        const lng = loc.lng;
        if (selectedRegion === 'miami') {
          // South Florida: Miami-Dade, Broward, Palm Beach
          const isSouthFL = lat >= 25.4 && lat <= 26.9 && lng >= -80.6 && lng <= -80.0;
          if (!isSouthFL) return false;
        } else if (selectedRegion === 'tampa') {
          // Tampa Bay / Pinellas / Hillsborough
          const isTampa = lat >= 27.6 && lat <= 28.3 && lng >= -82.9 && lng <= -82.1;
          if (!isTampa) return false;
        } else if (selectedRegion === 'orlando') {
          // Orlando / Central Florida
          const isOrlando = lat >= 28.1 && lat <= 29.0 && lng >= -81.9 && lng <= -80.9;
          if (!isOrlando) return false;
        } else if (selectedRegion === 'swfl') {
          // Southwest Florida: Manatee, Sarasota, Charlotte, Lee, Collier
          const isSWFL = lat >= 25.9 && lat <= 27.6 && lng >= -82.8 && lng <= -81.5;
          if (!isSWFL) return false;
        } else if (selectedRegion === 'jax') {
          // North Florida / Jacksonville
          const isNorthFL = lat >= 29.5;
          if (!isNorthFL) return false;
        } else if (selectedRegion === 'keys') {
          // Florida Keys
          const isKeys = lat < 25.3 && lng < -80.2;
          if (!isKeys) return false;
        }
      }

      // 3. Alphabetical Letter Match
      if (selectedLetter !== 'all') {
        if (!loc.name.toUpperCase().startsWith(selectedLetter)) {
          return false;
        }
      }

      return true;
    });
  }, [locations, searchQuery, selectedRegion, selectedLetter]);

  // Group filtered locations alphabetically by first letter
  const groupedLocations = useMemo(() => {
    const groups: Record<string, LocationDirectoryItem[]> = {};
    for (const loc of filteredLocations) {
      const firstLetter = loc.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(loc);
    }
    return groups;
  }, [filteredLocations]);

  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    for (const loc of locations) {
      letters.add(loc.name.charAt(0).toUpperCase());
    }
    return Array.from(letters).sort();
  }, [locations]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fffafc] via-[#fff5f9] to-[#ffe8f4]">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-pink-300 via-pink-300 to-pink-300 text-gray-800 text-xs py-2.5 text-center font-semibold tracking-wide px-4 shadow-sm">
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
          <span>
            <i className="fa-solid fa-star text-yellow-300 mr-1 animate-pulse"></i> #1 Top-Rated Cleaning Services Across All of Florida
          </span>
          <span className="hidden sm:inline">|</span>
          <a href="tel:19412222080" className="hover:underline flex items-center gap-1 font-bold">
            <i className="fa-solid fa-phone mr-1"></i> Call Now: (941) 222-2080
          </a>
        </div>
      </div>

      {/* Main Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100/70 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24 relative">
            {/* Mobile Call (Left) */}
            <a
              href="tel:19412222080"
              className="lg:hidden w-10 h-10 flex items-center justify-center bg-pink-50 text-pink-500 rounded-full border border-pink-100 shadow-sm active:scale-95 transition-all"
            >
              <i className="fa-solid fa-phone text-sm"></i>
            </a>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center group absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <img
                src="/images/logo.png"
                alt="Sweet Maid Cleaning Service"
                className="h-16 md:h-20 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-pink-400 transition-colors">
                Home
              </Link>
              <Link href="/about/" className="text-sm font-semibold text-gray-700 hover:text-pink-400 transition-colors">
                About Us
              </Link>
              <Link href="/house-cleaning/" className="text-sm font-semibold text-gray-700 hover:text-pink-400 transition-colors">
                Services
              </Link>
              <Link href="/locations/" className="text-sm font-bold text-pink-500 bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-full transition-colors">
                Locations
              </Link>
              <Link href="/blog/" className="text-sm font-semibold text-gray-700 hover:text-pink-400 transition-colors">
                Blogs
              </Link>
              <Link href="/gallery/" className="text-sm font-semibold text-gray-700 hover:text-pink-400 transition-colors">
                Gallery
              </Link>
              <Link href="/book-online/" className="text-sm font-bold text-pink-500 hover:text-pink-600 transition-colors">
                Book Online
              </Link>
              <Link href="/login/" className="text-sm font-semibold text-gray-700 hover:text-pink-400 transition-colors">
                Login
              </Link>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a href="tel:19412222080" className="flex items-center gap-2 text-pink-500 font-bold hover:text-pink-700 transition text-sm">
                <i className="fa-solid fa-phone"></i> (941) 222-2080
              </a>
              <Link
                href="/book-online/"
                className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white text-sm px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-calendar-check text-white"></i> Book Online
              </Link>
            </div>

            {/* Mobile Header Quick Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="/book-online/"
                className="bg-gradient-to-r from-pink-400 to-pink-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1 active:scale-95 transition-all"
              >
                <i className="fa-solid fa-calendar-check text-[10px]"></i> Book Online
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-2xl text-gray-800 p-2"
                aria-label="Toggle Navigation"
              >
                <i className={mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-pink-100 px-6 py-6 space-y-4 shadow-xl animate-fadeIn">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-gray-800">
            Home
          </Link>
          <Link href="/about/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-gray-800">
            About Us
          </Link>
          <Link href="/house-cleaning/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-gray-800">
            Our Services
          </Link>
          <Link href="/locations/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-bold text-pink-500">
            Locations Directory
          </Link>
          <Link href="/blog/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-gray-800">
            Blogs
          </Link>
          <Link href="/gallery/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-gray-800">
            Gallery
          </Link>
          <Link href="/login/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-gray-800">
            Login
          </Link>
          <div className="pt-4 border-t border-pink-100 flex flex-col gap-3">
            <Link
              href="/#quote"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white text-center py-3 rounded-xl font-bold shadow-md"
            >
              Get Free Quote
            </Link>
            <a
              href="tel:19412222080"
              className="w-full bg-pink-50 text-pink-600 text-center py-3 rounded-xl font-bold border border-pink-200"
            >
              <i className="fa-solid fa-phone mr-2"></i> (941) 222-2080
            </a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-12 pb-8 md:pt-16 md:pb-12 text-center px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200/80 text-pink-600 px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold shadow-sm mb-6">
            <i className="fa-solid fa-map-location-dot"></i> Statewide Florida Coverage • 799+ Cities Served
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 font-serif leading-tight mb-4">
            Find Sweet Maid Cleaning in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-pink-400 to-rose-400">
              Your Florida City
            </span>
          </h1>

          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Search our complete directory of all 799+ cities, towns, and neighborhoods across Florida. 
            Choose your location below to get instant local pricing and guaranteed 5-star service.
          </p>

          {/* Interactive Live Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-pink-200/30 border-2 border-pink-200 focus-within:border-pink-400 focus-within:ring-4 focus-within:ring-pink-100 transition-all p-2">
              <div className="pl-4 pr-3 text-pink-400 text-xl">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any Florida city (e.g., Tampa, Miami, Orlando, Naples, Brickell)..."
                className="w-full bg-transparent text-gray-800 placeholder-gray-400 text-base sm:text-lg focus:outline-none py-2"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors mr-2"
                  title="Clear search"
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              )}
            </div>
          </div>

          {/* Region Quick Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-4">
            {REGIONS.map((reg) => (
              <button
                key={reg.id}
                onClick={() => {
                  setSelectedRegion(reg.id);
                  setSelectedLetter('all');
                }}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                  selectedRegion === reg.id
                    ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-pink-200/60 scale-105'
                    : 'bg-white text-gray-700 border border-pink-100 hover:bg-pink-50 hover:border-pink-200'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>

          {/* Alphabetical Letter Filter */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-3xl mx-auto mt-4 pt-4 border-t border-pink-100/60">
            <button
              onClick={() => setSelectedLetter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedLetter === 'all'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50'
              }`}
            >
              ALL
            </button>
            {availableLetters.map((ltr) => (
              <button
                key={ltr}
                onClick={() => setSelectedLetter(ltr)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                  selectedLetter === ltr
                    ? 'bg-pink-500 text-white shadow-sm scale-110'
                    : 'text-gray-600 hover:text-pink-500 hover:bg-pink-50'
                }`}
              >
                {ltr}
              </button>
            ))}
          </div>

          {/* Results Summary Counter */}
          <div className="text-xs sm:text-sm text-gray-500 font-medium mt-4">
            Showing <strong className="text-pink-500 font-bold">{filteredLocations.length}</strong> of {locations.length} service locations in Florida
            {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
          </div>
        </div>
      </section>

      {/* Locations Directory Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-8 pb-16">
        {filteredLocations.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-pink-100 shadow-md max-w-lg mx-auto my-12">
            <div className="w-16 h-16 bg-pink-50 text-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <i className="fa-solid fa-location-crosshairs"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">No Locations Found</h3>
            <p className="text-gray-600 text-sm mb-6">
              We couldn't find any location matching &ldquo;{searchQuery}&rdquo;. We serve all of Florida!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('all');
                  setSelectedLetter('all');
                }}
                className="px-6 py-2.5 bg-pink-50 text-pink-600 rounded-full text-sm font-bold hover:bg-pink-100 transition-colors"
              >
                Reset Search Filters
              </button>
              <a
                href="tel:19412222080"
                className="px-6 py-2.5 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                Call Us for Custom Quote
              </a>
            </div>
          </div>
        ) : (
          /* Alphabetical Sections Grid */
          <div className="space-y-12 mt-6">
            {Object.keys(groupedLocations)
              .sort()
              .map((letter) => (
                <section key={letter} id={`letter-${letter}`} className="scroll-mt-32">
                  <div className="flex items-center gap-3 mb-6 pb-2 border-b border-pink-100">
                    <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-500 text-white font-serif font-bold text-xl flex items-center justify-center shadow-md shadow-pink-200">
                      {letter}
                    </span>
                    <span className="text-xs uppercase tracking-widest font-bold text-gray-400">
                      {groupedLocations[letter].length} {groupedLocations[letter].length === 1 ? 'Location' : 'Locations'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {groupedLocations[letter].map((city) => (
                      <Link
                        key={city.slug}
                        href={`/${city.slug}/`}
                        className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <i className="fa-solid fa-location-dot text-pink-400 text-xs sm:text-sm group-hover:scale-125 transition-transform flex-shrink-0"></i>
                          <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate group-hover:text-pink-600 transition-colors">
                            {city.name}
                          </span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-[10px] text-gray-300 group-hover:text-pink-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1"></i>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
          </div>
        )}
      </main>

      {/* Bottom CTA Banner */}
      <section className="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-500 text-white py-12 px-6 lg:px-8 mt-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold font-serif">
            Ready for a Spotless Home in Florida?
          </h2>
          <p className="text-pink-100 text-sm sm:text-base max-w-xl mx-auto">
            Book top-rated, fully insured, and vetted cleaners in minutes. 100% Satisfaction Guaranteed on every clean.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/#quote"
              className="bg-white text-pink-600 px-8 py-3.5 rounded-full font-bold shadow-xl hover:bg-pink-50 hover:scale-105 transition-all text-sm"
            >
              Get Free Instant Quote
            </Link>
            <a
              href="tel:19412222080"
              className="bg-pink-600/60 backdrop-blur-md border border-pink-200/40 text-white px-8 py-3.5 rounded-full font-bold hover:bg-pink-600/80 transition-all text-sm flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-phone"></i> (941) 222-2080
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-100 py-12 px-6 lg:px-8">
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
            <Link href="/blog/" className="hover:text-pink-500 transition-colors">Blog</Link>
            <Link href="/gallery/" className="hover:text-pink-500 transition-colors">Gallery</Link>
          </div>
          <div className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Sweet Maid Cleaning Service. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
