$sourceFile = "index.html"
$content = Get-Content $sourceFile -Raw

# 1. Extract Master Components (Header, Footer, Scripts)
$headMatch = [regex]::Match($content, '(?s)<head.*?>.*?</head>')
$sourceHead = $headMatch.Value
# Strip specific page meta to be replaced
$sourceHead = [regex]::Replace($sourceHead, '(?s)<title>.*?</title>', '')
$sourceHead = [regex]::Replace($sourceHead, '(?s)<meta name="description".*?>', '')
$sourceHead = [regex]::Replace($sourceHead, '(?s)<meta name="keywords".*?>', '')
$sourceHead = [regex]::Replace($sourceHead, '(?s)<link rel="canonical".*?>', '')
$sourceHead = [regex]::Replace($sourceHead, '(?s)<script type="application/ld\+json">.*?</script>', '')
$sourceHead = $sourceHead -replace '(?i)<head.*?>', '' -replace '(?i)</head>', ''

$headerMatch = [regex]::Match($content, '(?s)<header.*?</header>')
$sourceHeader = $headerMatch.Value

$menuStartMarker = "<!-- Mobile Menu -->"
$menuEndMatch = [regex]::Match($content, '(?s)<!-- ================================================\s+HERO')
$menuStartIdx = $content.IndexOf($menuStartMarker)
if ($menuStartIdx -ge 0 -and $menuEndMatch.Success) {
    $sourceMenu = $content.Substring($menuStartIdx, $menuEndMatch.Index - $menuStartIdx).Trim()
} else { $sourceMenu = "" }

$footerStartMatch = [regex]::Match($content, '(?s)<footer.*?>')
$footerStartIdx = $footerStartMatch.Index
$sourceFooter = $content.Substring($footerStartIdx)
$footerEndIdx = $sourceFooter.IndexOf("</footer>") + 9
$sourceFooter = $sourceFooter.Substring(0, $footerEndIdx)

$postFooterIdx = $content.IndexOf("</footer>") + 9
$postFooter = $content.Substring($postFooterIdx)
$scriptsMatch = [regex]::Matches($postFooter, '(?s)<script>.*?</script>')
$sourceScripts = ""
foreach ($m in $scriptsMatch) { $sourceScripts += $m.Value + "`n" }

# Fix Navigation Links for Aux Pages
$sourceHeader = $sourceHeader -replace 'href="#home"', 'href="index.html"'
$sourceHeader = $sourceHeader -replace 'href="#about"', 'href="about.html"'
$sourceHeader = $sourceHeader -replace 'href="#contact"', 'href="#quote"'

$sourceMenu = $sourceMenu -replace 'href="#home"', 'href="index.html"'
$sourceMenu = $sourceMenu -replace 'href="#about"', 'href="about.html"'
$sourceMenu = $sourceMenu -replace 'href="#contact"', 'href="#quote"'

# Fix Logo Link (Specific Match)
$sourceHeader = $sourceHeader -replace '(?i)<a href="#" class="flex items-center group">', '<a href="index.html" class="flex items-center group">'

# Extract Service Grid (for "Services Card")
$serviceGridMatch = [regex]::Match($content, '(?s)<!-- ================================================\s+SERVICES CAROUSEL.*?<!-- ================================================\s+DETAILED')
if ($serviceGridMatch.Success) {
    $sourceServices = $serviceGridMatch.Value
    $sourceServices = $sourceServices -replace '<!-- ================================================\s+DETAILED.*', ''
} else { $sourceServices = "<!-- Service Grid Not Found -->" }

# Extract Service Areas & Map
$areasMatch = [regex]::Match($content, '(?s)<!-- ================================================\s+AREAS & MAP.*?<!-- ================================================\s+REVIEWS')
if ($areasMatch.Success) {
    $sourceAreas = $areasMatch.Value
    $sourceAreas = $sourceAreas -replace '<!-- ================================================\s+REVIEWS.*', ''
} else { $sourceAreas = "<!-- Areas Not Found -->" }

# Extract Reviews
$reviewsMatch = [regex]::Match($content, '(?s)<!-- ================================================\s+REVIEWS.*?<!-- ================================================\s+FAQ')
if ($reviewsMatch.Success) {
    $sourceReviews = $reviewsMatch.Value
    $sourceReviews = $sourceReviews -replace '<!-- ================================================\s+FAQ.*', ''
} else { $sourceReviews = "<!-- Reviews Not Found -->" }

# Extract FAQ
$faqMatch = [regex]::Match($content, '(?s)<!-- ================================================\s+FAQ.*?<!-- ================================================\s+CONTACT')
if ($faqMatch.Success) {
    $sourceFAQ = $faqMatch.Value
    $sourceFAQ = $sourceFAQ -replace '<!-- ================================================\s+CONTACT.*', ''
} else { $sourceFAQ = "<!-- FAQ Not Found -->" }

# Extract Contact/Quote
$quoteMatch = [regex]::Match($content, '(?s)<!-- ================================================\s+CONTACT / CTA.*?<!-- ================================================\s+FOOTER')
if ($quoteMatch.Success) {
    $sourceQuote = $quoteMatch.Value
    $sourceQuote = $sourceQuote -replace '<!-- ================================================\s+FOOTER.*', ''
} else { $sourceQuote = "<!-- Quote Not Found -->" }

# Define Page Content
$pages = @{
    "about.html" = @{
        Title = "About Sweet Maid Cleaning Service | #1 Rated in Bradenton & Sarasota"
        Desc = "Learn about Sweet Maid Cleaning Service, the top-rated, woman-owned cleaning company in Bradenton and Sarasota. Dedicated to eco-friendly, reliable, and 5-star service."
        Keywords = "about sweet maid, cleaning company Bradenton, maid service story, woman owned business Sarasota"
        HeroTitle = "Our Story of Sparkle"
        HeroSubtitle = "Trusted by 1000+ Families in Southwest Florida"
        Content = @"
    <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-16 items-center">
                <div data-aos="fade-right">
                    <span class="text-pink-300 font-bold tracking-wide uppercase text-sm">Who We Are</span>
                    <h2 class="text-4xl lg:text-5xl font-bold mt-3 mb-6 font-playfair text-gray-900">More Than Just a Cleaning Service</h2>
                    <p class="text-lg text-gray-600 mb-6 leading-relaxed">
                        Sweet Maid was born from a simple belief: a clean home is a happy home. Founded right here in Bradenton, we set out to create a cleaning service that wasn't just about scrubbing floors, but about giving families back their most precious resource—time.
                    </p>
                    <p class="text-lg text-gray-600 mb-8 leading-relaxed">
                        Today, we are proud to be Southwest Florida's highest-rated cleaning team, serving homeowners from Anna Maria Island to Lakewood Ranch with the same detailed care and "sweet" touch that started it all.
                    </p>
                    <div class="grid grid-cols-2 gap-6">
                        <div class="p-4 bg-pink-50 rounded-xl">
                            <div class="text-3xl font-bold text-pink-400 mb-1">500+</div>
                            <div class="text-sm text-gray-600">5-Star Reviews</div>
                        </div>
                        <div class="p-4 bg-pink-50 rounded-xl">
                            <div class="text-3xl font-bold text-pink-400 mb-1">1000+</div>
                            <div class="text-sm text-gray-600">Happy Clients</div>
                        </div>
                    </div>
                </div>
                <div class="relative" data-aos="fade-left">
                    <img src="https://i.ibb.co/QSD3Ydt/image.jpg" alt="Sweet Maid Team in Bradenton" class="rounded-2xl shadow-2xl relative z-10 w-full object-cover h-[600px]">
                    <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl -z-10"></div>
                    <div class="absolute -top-10 -right-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl -z-10"></div>
                </div>
            </div>
        </div>
    </section>
"@
    }

    "blog.html" = @{
        Title = "Cleaning Tips & Home Care Blog | Sweet Maid Bradenton"
        Desc = "Expert cleaning tips, home organization hacks, and maintenance advice from Sweet Maid. Keep your Bradenton home sparkling all year round."
        Keywords = "cleaning blog, housekeeping tips, home organization Bradenton, cleaning hacks"
        HeroTitle = "Sweet Tips & Tidbits"
        HeroSubtitle = "Expert Advice for a Cleaner, Happier Home"
        Content = @"
    <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-6 lg:px-8">
             <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Blog Post 1 -->
                <article class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                    <div class="relative h-64 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1584622050111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Kitchen cleaning guide" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    </div>
                    <div class="p-8">
                        <div class="text-sm text-pink-400 font-bold mb-3">Kitchen Cleaning</div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-400 transition-colors">5 Secrets to a Grease-Free Kitchen</h3>
                        <p class="text-gray-600 mb-4 line-clamp-3">Grease build-up is the enemy of every home chef. Learn our professional secrets to keeping your cabinets and countertops pristine...</p>
                        <a href="#" class="text-pink-400 font-semibold hover:text-pink-300 inline-flex items-center gap-2">Read More <i class="fa-solid fa-arrow-right text-sm"></i></a>
                    </div>
                </article>

                <!-- Blog Post 2 -->
                <article class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                    <div class="relative h-64 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1527513076735-32dc2007ce45?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Deep cleaning checklist" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    </div>
                    <div class="p-8">
                        <div class="text-sm text-pink-400 font-bold mb-3">Deep Cleaning</div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-400 transition-colors">The Ultimate Spring Cleaning Checklist for Florida Homes</h3>
                        <p class="text-gray-600 mb-4 line-clamp-3">Florida humidity brings unique challenges. Here is the ultimate deep cleaning checklist every Bradenton homeowner needs this season...</p>
                        <a href="#" class="text-pink-400 font-semibold hover:text-pink-300 inline-flex items-center gap-2">Read More <i class="fa-solid fa-arrow-right text-sm"></i></a>
                    </div>
                </article>

                <!-- Blog Post 3 -->
                <article class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                    <div class="relative h-64 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1581578731117-104f2a921a2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Eco-friendly cleaning" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    </div>
                    <div class="p-8">
                        <div class="text-sm text-pink-400 font-bold mb-3">Green Cleaning</div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-400 transition-colors">Why We Use Eco-Friendly Products (And You Should Too)</h3>
                        <p class="text-gray-600 mb-4 line-clamp-3">Protect your pets, your kids, and the planet. Discover the benefits of green cleaning and the products we trust in your home...</p>
                        <a href="#" class="text-pink-400 font-semibold hover:text-pink-300 inline-flex items-center gap-2">Read More <i class="fa-solid fa-arrow-right text-sm"></i></a>
                    </div>
                </article>
            </div>
        </div>
    </section>
"@
    }

    "gallery.html" = @{
        Title = "Our Work Gallery | Before & After Cleaning Photos | Sweet Maid"
        Desc = "See the sparkle for yourself! Browse our gallery of before and after cleaning photos from homes in Bradenton, Sarasota, and Lakewood Ranch."
        Keywords = "cleaning gallery, before and after cleaning photos, maid service portfolio, cleaning results Bradenton"
        HeroTitle = "See The Sparkle"
        HeroSubtitle = "Real Results from Real Homes in Southwest Florida"
        Content = @"
    <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <!-- Gallery Item 1 -->
                 <div class="group relative overflow-hidden rounded-2xl shadow-lg h-80">
                    <img src="https://i.ibb.co/QSD3Ydt/image.jpg" alt="Sparkling Living Room in Bradenton" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <p class="text-white font-bold text-lg">Living Room Deep Clean</p>
                    </div>
                 </div>
                 <!-- Gallery Item 2 -->
                 <div class="group relative overflow-hidden rounded-2xl shadow-lg h-80">
                    <img src="images/WhatsApp Image 2026-02-10 at 11.18.08 PM.jpeg" alt="Modern Kitchen in Sarasota" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <p class="text-white font-bold text-lg">Kitchen Revitalization</p>
                    </div>
                 </div>
                 <!-- Gallery Item 3 -->
                 <div class="group relative overflow-hidden rounded-2xl shadow-lg h-80">
                    <img src="images/WhatsApp Image 2026-02-10 at 11.18.09 PM (2).jpeg" alt="Bedroom Organization in Lakewood Ranch" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <p class="text-white font-bold text-lg">Detailed dusting & Polishing</p>
                    </div>
                 </div>
                 <!-- Gallery Item 4 -->
                 <div class="group relative overflow-hidden rounded-2xl shadow-lg h-80">
                    <img src="images/WhatsApp Image 2026-02-10 at 11.18.09 PM (1).jpeg" alt="Airbnb Staging in Anna Maria" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <p class="text-white font-bold text-lg">Airbnb Turnover Perfection</p>
                    </div>
                 </div>
                 <!-- Gallery Item 5 -->
                 <div class="group relative overflow-hidden rounded-2xl shadow-lg h-80">
                    <img src="images/WhatsApp Image 2026-02-11 at 12.07.26 PM.jpeg" alt="Post-Construction Clean" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <p class="text-white font-bold text-lg">Post-Construction Cleanup</p>
                    </div>
                 </div>
                 <!-- Gallery Item 6 -->
                 <div class="group relative overflow-hidden rounded-2xl shadow-lg h-80">
                    <img src="images/WhatsApp Image 2026-02-10 at 11.18.08 PM (4).jpeg" alt="Luxury Bathroom Clean" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <p class="text-white font-bold text-lg">Spa-Like Bathroom Shine</p>
                    </div>
                 </div>
            </div>
        </div>
    </section>
"@
    }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($fileName in $pages.Keys) {
    $info = $pages[$fileName]
    
    # Construct Mini-Hero (Different from Index Hero)
    $heroSection = @"
    <!-- ================================================
       MINI HERO ($fileName)
    ================================================ -->
    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-pink-50">
        <div class="absolute inset-0 z-0 opacity-10">
             <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div class="absolute top-1/2 -left-24 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
            <h1 class="text-4xl md:text-6xl font-black mb-6 tracking-tight text-gray-900 font-playfair">
                $($info.HeroTitle)
            </h1>
            <p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto font-light">
                $($info.HeroSubtitle)
            </p>
        </div>
    </section>
"@

    $pageHtml = @"
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$($info.Title)</title>
    <meta name="description" content="$($info.Desc)">
    <meta name="keywords" content="$($info.Keywords)">
    <link rel="canonical" href="https://sweetmaidcleaning.com/$fileName" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://sweetmaidcleaning.com/$fileName">
    <meta property="og:title" content="$($info.Title)">
    <meta property="og:description" content="$($info.Desc)">
    <meta property="og:image" content="https://i.ibb.co/QSD3Ydt/image.jpg">

    $sourceHead
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "$($info.Title)",
      "description": "$($info.Desc)",
      "url": "https://sweetmaidcleaning.com/$fileName"
    }
    </script>
</head>
<body class="antialiased font-sans">
    $sourceHeader
    $sourceMenu
    $heroSection
    $($info.Content)
    $sourceServices
    $sourceReviews
    $sourceAreas
    $sourceFAQ
    $sourceQuote
    $sourceFooter
    $sourceScripts
</body>
</html>
"@
    [System.IO.File]::WriteAllText((Resolve-Path .).Path + "\$fileName", $pageHtml, $utf8NoBom)
    Write-Host "Created $fileName"
}
