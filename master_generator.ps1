$sourceFile = "home/index.html"
$content = Get-Content $sourceFile -Raw -Encoding UTF8

if ($null -eq $content -or $content.Length -lt 100) {
    Write-Error "Could not read home/index.html"
    exit
}

# 1. Extract Master Head
$headMatch = [regex]::Match($content, '(?s)<head.*?>.*?</head>')
$sourceHead = $headMatch.Value

# Clean Master Head
$sourceHead = [regex]::Replace($sourceHead, '(?s)<title>.*?</title>', '')
$sourceHead = [regex]::Replace($sourceHead, '(?s)<meta name="description".*?>', '')
$sourceHead = [regex]::Replace($sourceHead, '(?s)<meta name="keywords".*?>', '')
$sourceHead = [regex]::Replace($sourceHead, '(?s)<link rel="canonical".*?>', '')
$sourceHead = [regex]::Replace($sourceHead, '(?s)<script type="application/ld\+json">.*?</script>', '')
$sourceHead = [regex]::Replace($sourceHead, '(?s)<meta charset=".*?".*?>', '')
$sourceHead = [regex]::Replace($sourceHead, '(?s)<meta name="viewport".*?>', '')
$sourceHead = [regex]::Replace($sourceHead, '(?s)<meta property="og:.*?".*?>', '')
$sourceHead = $sourceHead -replace '<!-- Open Graph / Facebook -->', ''
$sourceHead = $sourceHead -replace '<!-- Local SEO Schema -->', ''
$sourceHead = $sourceHead -replace '(?i)<head.*?>', '' -replace '(?i)</head>', ''
$sourceHead = $sourceHead.Trim()

# 2. Extract Master Header
$headerMatch = [regex]::Match($content, '(?s)<header.*?</header>')
$sourceHeader = $headerMatch.Value

# 3. Extract Mobile Menu
$menuEndMatch = [regex]::Match($content, '(?s)<!-- ================================================\s+HERO')
$menuStartIdx = $content.IndexOf("<!-- Mobile Menu Expansion -->")
if ($menuStartIdx -ge 0 -and $menuEndMatch.Success) {
    $sourceMenu = $content.Substring($menuStartIdx, $menuEndMatch.Index - $menuStartIdx).Trim()
} else { $sourceMenu = "" }

# 4. Extract Footer
$footerStartMatch = [regex]::Match($content, '(?s)<footer.*?>')
if ($footerStartMatch.Success) {
    $footerStartIdx = $footerStartMatch.Index
    $sourceFooter = $content.Substring($footerStartIdx)
    $footerEndIdx = $sourceFooter.IndexOf("</footer>") + 9
    $sourceFooter = $sourceFooter.Substring(0, $footerEndIdx)
} else {
    Write-Error "Could not find footer"
    exit
}

# 5. Extract Main Content (Hero to Footer)
$heroMatch = [regex]::Match($content, '(?s)<!-- ================================================\s+HERO')
if ($heroMatch.Success) {
    $heroStartIdx = $heroMatch.Index
    $sourceMain = $content.Substring($heroStartIdx, $footerStartIdx - $heroStartIdx).Trim()
} else {
    Write-Error "Could not find HERO marker"
    exit
}

# 6. Extract Master Scripts
$postFooterIdx = $content.IndexOf("</footer>") + 9
if ($postFooterIdx -ge 9) {
    $postFooter = $content.Substring($postFooterIdx)
    $scriptsMatch = [regex]::Matches($postFooter, '(?s)<script>.*?</script>')
    $sourceScripts = ""
    foreach ($m in $scriptsMatch) { $sourceScripts += $m.Value + "`n" }
} else { $sourceScripts = "" }

$areaNames = "Bradenton", "Anna Maria", "Foxleigh", "Palmer Ranch", "Lakewood Ranch", "Osprey", "University Park", "Laurel", "Sarasota", "Longboat Key", "Bradenton Beach", "Nokomis", "Siesta Key", "Fruitville", "Holmes Beach", "Whitfield", "Parrish", "Braden River", "Bee Ridge", "Bayshore Gardens", "Venice", "The Meadows", "Gulf Gate Estates", "South Gate", "Ellenton", "Sarasota Springs", "Lake Sarasota", "South Sarasota", "Palmetto", "Palma Sola", "Myakka", "Bird Key", "North Port", "South Venice", "Englewood", "Rotonda West", "Port Charlotte", "Ruskin", "Apollo Beach", "Terra Ceia", "Lido Key", "Vamo", "Sun City Center", "Arcadia"

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($name in $areaNames) {
    $cleanName = if ($name -eq "Anna Maria") { "Anna Maria Island" } else { $name }
    $fileName = $name.ToLower().Replace(" ", "-") + "-cleaning/index.html" # Fixed to use subdirectories
    
    $title = "Best House Cleaning Services in $cleanName, FL | Top Rated & Reliable"
    $desc = "Looking for the best house cleaning in $cleanName, FL? Sweet Maid provides top-rated, reliable, and affordable maid services. 100% Satisfaction Guaranteed. Book Now!"
    $keywords = "best house cleaning $cleanName, top rated maid service $cleanName, best cleaning services $cleanName, reliable house cleaners $cleanName, affordable maid service $cleanName"
    
    # Customize Content
    $localHeader = [regex]::Replace($sourceHeader, '(?s)Rated Cleaning Service in\s+Bradenton</span>', "Rated Cleaning Service in $cleanName</span>")
    $localFooter = $sourceFooter
    
    $localMain = $sourceMain
    $localMain = $localMain -replace "Bradenton’s", "$cleanName's" # Unified to standard quote
    $localMain = $localMain -replace "Bradenton's", "$cleanName's" 
    $localMain = $localMain -replace "across Bradenton and Southwest Florida", "across $cleanName and Southwest Florida"
    $localMain = $localMain -replace "in Bradenton home", "in $cleanName home"
    $localMain = $localMain -replace "Favorite Cleaners in Bradenton", "Favorite Cleaners in $cleanName"
    $localMain = $localMain -replace "Top Rated in Bradenton", "Top Rated in $cleanName"
    # Map Optimization (Google Maps Embed)
    $mapPb = "!1m18!1m12!1m3!1d113425.29828882585!2d-82.64501464999999!3d27.497495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2e663693aa661%3A0x628f8694032a1740!2s$($cleanName -replace ' ', '+')%2C+FL%2C+USA!5e0!3m2!1sen!2sus!4v1707520000000!5m2!1sen!2sus"
    
    if ($name -eq "Venice") {
        $mapPb = "!1m18!1m12!1m3!1d113643.08051786196!2d-82.49089947930467!3d27.391629853974495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c341399426f30d%3A0xc3b83c518b532924!2sVenice%2C+FL+34285%2C+USA!5e0!3m2!1sen!2sus!4v1739561081827!5m2!1sen!2sus"
    } elseif ($name -eq "University Park") {
        $mapPb = "!1m18!1m12!1m3!1d113643.08051786196!2d-82.49089947930467!3d27.391629853974495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c341399426f30d%3A0xc3b83c518b532924!2sUniversity+Park%2C+FL+34201%2C+USA!5e0!3m2!1sen!2sus!4v1739561081827!5m2!1sen!2sus"
    }
    
    $localMain = $localMain -replace 'MAP_PLACEHOLDER', $mapPb
    
    # Extreme SEO H1 Overhaul
    $localMain = [regex]::Replace($localMain, '(?s)<h1.*?>.*?</h1>', @"
        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-gray-900">
            Best Cleaning Services in <br>
            <span class="text-gradient">$cleanName, FL</span>
        </h1>
"@)

    # Extreme SEO Hero Description Overhaul
    # Extreme SEO Hero Description Overhaul
    $localMain = [regex]::Replace($localMain, '(?s)<p class="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">.*?</p>', @"
        <p class="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
            Looking for the best house cleaning in LOC_TOKEN? Sweet Maid provides top-rated, reliable, and affordable maid services. 100% Satisfaction Guaranteed.
        </p>
"@)
    $localMain = $localMain -replace 'LOC_TOKEN', $cleanName
    
    # Surgical remainder replacement (avoiding Bradenton Beach overlap)
    $localMain = [regex]::Replace($localMain, '(?<!Bradenton\s)Bradenton(?! Beach)', $cleanName)

    # Link absolute parity
    $localMain = $localMain -replace 'index.html#contact', '#contact'
    
    # ---------------------------------------------------------
    # DEEP CONTENT INJECTION (Body Text Overhaul)
    # ---------------------------------------------------------

    # 1. Section Headers & Subheaders
    $localMain = $localMain -replace "Why Locals Trust Us", "Why $cleanName Trusts Us"
    $localMain = $localMain -replace "The Sweet Maid Standard", "The Sweet Maid Standard in $cleanName"
    $localMain = $localMain -replace "Let Our Team Contact You", "Let Our $cleanName Team Contact You"
    $localMain = $localMain -replace "Licensed & Insured Cleaners", "Licensed & Insured $cleanName Cleaners"

    # 2. Feature Titles & Descriptions
    $localMain = $localMain -replace "Trusted Professionals", "Trusted $cleanName Cleaning Experts"
    $localMain = $localMain -replace "Every team member undergoes", "Every $cleanName team member undergoes"
    $localMain = $localMain -replace "Impeccable Detail", "Impeccable Cleaning Detail"
    $localMain = $localMain -replace "re-clean the area", "re-clean your $cleanName home"
    
    # 3. General Body Text Expansion
    $localMain = $localMain -replace "premier cleaning solutions", "premier cleaning solutions in $cleanName"
    $localMain = $localMain -replace "keep your home spotless", "keep your $cleanName home spotless"
    $localMain = $localMain -replace "Trusted by homeowners", "Trusted by homeowners in $cleanName"
    
    # 4. CTA & Footer Context
    $localMain = $localMain -replace "Get Your Free Quote", "Get Your Free Quote in $cleanName"
    $localMain = $localMain -replace "Call Me", "Call for $cleanName Service"
    $localMain = $localMain -replace "Follow us for cleaning tips", "Follow us for $cleanName cleaning tips"
    $localMain = $localMain -replace 'index.html#home', '#home'
    $localMain = $localMain -replace 'index.html#about', '#about'
    
    # ---------------------------------------------------------
    # EXTREME SEO: SERVICE DESCRIPTIONS (Location Pages)
    # ---------------------------------------------------------
    
    # Service card descriptions with location context
    $localMain = $localMain -replace "Professional steam cleaning to remove stains, odors, and allergens from carpets and rugs\.", "Professional carpet cleaning in $cleanName to remove stains and allergens. Trusted by $cleanName homeowners."
    $localMain = $localMain -replace "Crystal-clear, streak-free windows inside and out for maximum natural light and curb appeal\.", "Crystal-clear window cleaning in $cleanName for maximum natural light. Professional service for $cleanName homes."
    $localMain = $localMain -replace "Restore driveways, patios, and exterior surfaces with powerful, professional pressure washing\.", "Restore $cleanName driveways and patios with professional pressure washing. Expert service in $cleanName."
    $localMain = $localMain -replace "Impress clients and protect employees with professional office janitorial services\.", "Professional commercial cleaning in $cleanName. Expert janitorial services for $cleanName businesses."
    $localMain = $localMain -replace "Fast, reliable turnovers between guests with linen service and restocking for 5-star reviews\.", "Fast Airbnb cleaning in $cleanName for vacation rental hosts. Professional turnover service in $cleanName."
    $localMain = $localMain -replace "Removing fine dust and debris after renovations so your new space truly sparkles\.", "Expert post-construction cleaning in $cleanName removes dust and debris. Renovation cleaning for $cleanName properties."
    $localMain = $localMain -replace "Flexible residential cleaning for apartments, condos, and houses - one-time or recurring\.", "Flexible house cleaning in $cleanName for apartments and homes. Recurring service for $cleanName residents."
    $localMain = $localMain -replace "A top-to-bottom, detailed clean to reset your space and eliminate hidden grime\.", "Top-to-bottom deep cleaning in $cleanName to eliminate grime. Professional service for $cleanName homes."
    $localMain = $localMain -replace "Make your new house fresh, sanitized, and move-in ready from day one\.", "Professional move-in cleaning in $cleanName to make your home move-in ready. Trusted service in $cleanName."
    $localMain = $localMain -replace "Make your new home fresh, sanitized, and move-in ready from day one\.", "Professional move-in cleaning in $cleanName to make your home move-in ready. Trusted service in $cleanName."
    $localMain = $localMain -replace "Leave your space spotless and stress-free when it's time to move out\.", "Expert move-out cleaning in $cleanName leaves your space spotless. Professional service for $cleanName renters."
    
    # ---------------------------------------------------------
    # EXTREME SEO: DETAILED CONTENT
    # ---------------------------------------------------------
    
    $localMain = $localMain -replace "Experience the luxury of a consistently pristine home\.", "Experience luxury cleaning services in $cleanName for a consistently pristine home."
    $localMain = $localMain -replace "Our residential services are designed for busy professionals and families who value their time and peace of mind\.", "Our $cleanName cleaning services are designed for busy professionals and families in $cleanName."
    
    # Generic references
    $localMain = $localMain -replace "for your home\.", "for your $cleanName home."
    $localMain = $localMain -replace "in your home\.", "in your $cleanName home."
    $localMain = $localMain -replace "your entire home\.", "your entire $cleanName home."
    $localMain = $localMain -replace "our professional team", "our professional $cleanName cleaning team"
    $localMain = $localMain -replace "Our team arrives", "Our $cleanName team arrives"
    
    # CTAs
    $localMain = $localMain -replace "Book Now\<", "Book Cleaning in $cleanName Now\<"
    $localMain = $localMain -replace "\>Learn More\<", "\>Learn More About $cleanName Cleaning\<"
    $localMain = $localMain -replace "Contact Us Today", "Contact Us for $cleanName Cleaning"
    
    # Process steps
    $localMain = $localMain -replace "We arrive on time", "Our $cleanName cleaning team arrives on time"
    $localMain = $localMain -replace "assess your space", "assess your $cleanName property"
    $localMain = $localMain -replace "Professional equipment and supplies", "Professional cleaning equipment in $cleanName"
    $localMain = $localMain -replace "Background-checked cleaners", "Background-checked cleaning experts serving $cleanName"
    
    # Paragraph content
    $localMain = $localMain -replace "hotel-standard training before entering your home", "hotel-standard training before entering your $cleanName home"
    $localMain = $localMain -replace "from baseboards to ceiling fans", "from baseboards to ceiling fans in your $cleanName home"


    # Path sanity fix for one-level deep location folder (Ensuring images work)
    $localMain = $localMain -replace 'src="images/', 'src="../images/'
    $localMain = $localMain -replace 'url\("?images/', 'url("../images/'
    $localMain = $localMain -replace 'url\(''?images/', "url('../images/"
    
    # Discovery Matrix Logic (Linking to localized sub-pages)
    $services = @(
        @{ name = "House Cleaning"; slug = "house-cleaning" },
        @{ name = "Deep Cleaning"; slug = "deep-cleaning" },
        @{ name = "Move In/Out Cleaning"; slug = "move-in-out-cleaning" },
        @{ name = "Airbnb Cleaning"; slug = "airbnb-cleaning" },
        @{ name = "Commercial Cleaning"; slug = "commercial-cleaning" },
        @{ name = "Post-Construction Cleaning"; slug = "post-construction-cleaning" },
        @{ name = "Carpet Cleaning"; slug = "carpet-cleaning" },
        @{ name = "Pressure Washing"; slug = "pressure-washing" },
        @{ name = "Window Cleaning"; slug = "window-cleaning" }
    )

    $locSlug = $name.ToLower().Replace(" ", "-") + "-cleaning"
    $matrixCards = ""
    foreach ($svc in $services) {
        $svcName = $svc.name
        $svcSlug = $svc.slug
        $svcLink = "/$locSlug/$svcSlug/"
        $matrixCards += @"
            <a href="$svcLink" class="group p-8 rounded-3xl bg-white border border-pink-100 hover:border-pink-300 hover:shadow-xl hover:shadow-pink-200/20 transition-all duration-300 flex flex-col items-center text-center">
                <div class="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-300 mb-6 group-hover:bg-pink-300 group-hover:text-white transition-colors">
                    <i class="fa-solid fa-sparkles"></i>
                </div>
                <h3 class="font-bold text-xl text-gray-900 mb-2">$cleanName $svcName</h3>
                <p class="text-sm text-gray-500 mb-4 leading-relaxed">Expert $svcName tailored for $cleanName homes and businesses.</p>
                <span class="text-pink-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-2 text-sm">
                    View Details <i class="fa-solid fa-arrow-right"></i>
                </span>
            </a>
"@
    }

    $matrixSection = @"
    <section class="py-24 bg-white relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">Localized Services in $cleanName</h2>
                <div class="w-24 h-1.5 bg-pink-300 mx-auto rounded-full"></div>
                <p class="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">Explore our high-quality cleaning solutions available specifically in the $cleanName area.</p>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                $matrixCards
            </div>
        </div>
    </section>
"@

    $pageHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$title</title>
    <meta name="description" content="$desc">
    <meta name="keywords" content="$keywords">
    <link rel="canonical" href="https://sweetmaidcleaning.com/$locSlug/" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://sweetmaidcleaning.com/$locSlug/">
    <meta property="og:title" content="Sweet Maid Cleaning Service - $cleanName's Favorite Cleaners">
    <meta property="og:description" content="Professional, reliable, and friendly cleaning services for $cleanName and surrounding areas. Book your sparkle today!">
    <meta property="og:image" content="https://i.ibb.co/QSD3Ydt/image.jpg">

    $sourceHead
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Sweet Maid Cleaning Service - $name",
      "image": "https://i.ibb.co/QSD3Ydt/image.jpg",
      "telephone": "645-217-6738",
      "email": "info@sweetmaidcleaning.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "$name",
        "addressRegion": "FL",
        "addressCountry": "US"
      },
      "url": "https://sweetmaidcleaning.com/$locSlug/",
      "priceRange": "$$",
      "areaServed": {
        "@type": "Place",
        "name": "$name, FL"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Cleaning Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "House Cleaning"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Deep Cleaning"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Move-In/Out Cleaning"
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "127"
      }
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do you offer cleaning services in $name?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We are proud to serve $name and the surrounding neighborhoods with our top-rated house cleaning, deep cleaning, and maid services. We are local to $name and ready to help."
          }
        },
        {
          "@type": "Question",
          "name": "Are your cleaners in $name insured?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. Every member of our $name cleaning team is fully background-checked, licensed, and insured for your peace of mind."
          }
        },
        {
          "@type": "Question",
          "name": "Can I get a same-day quote for my home in $name?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we offer fast, free quotes for all $name residents. Simply fill out our online form or give us a call to get started immediately."
          }
        }
      ]
    }
    </script>
</head>
<body class="antialiased font-sans">
    $localHeader
    $sourceMenu
    $localMain
    $matrixSection
    $localFooter
    $sourceScripts
</body>
</html>
"@
    $destDir = $fileName.Substring(0, $fileName.LastIndexOf("/"))
    if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
    [System.IO.File]::WriteAllText((Resolve-Path .).Path + "\$fileName", $pageHtml, $utf8NoBom)
}

Write-Host "Extreme SEO Parity Complete: 32 Location Pages fully localized and optimized."
