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

$areaNames = "Bradenton", "Anna Maria", "Foxleigh", "Palmer Ranch", "Lakewood Ranch", "Osprey", "University Park", "Laurel", "Sarasota", "Longboat Key", "Bradenton Beach", "Nokomis", "Siesta Key", "Fruitville", "Holmes Beach", "Whitfield", "Parrish", "Braden River", "Bee Ridge", "Bayshore Gardens", "Venice", "The Meadows", "Gulf Gate Estates", "South Gate", "Ellenton", "Sarasota Springs", "Lake Sarasota", "South Sarasota", "Palmetto", "Palma Sola", "Myakka", "Bird Key"

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($name in $areaNames) {
    $cleanName = if ($name -eq "Anna Maria") { "Anna Maria Island" } else { $name }
    $fileName = $name.ToLower().Replace(" ", "-") + "-cleaning/index.html" # Fixed to use subdirectories
    
    $title = "Sweet Maid Cleaning Service - #1 Rated House Cleaning in $cleanName, FL"
    $desc = "Looking for top-rated cleaning services in $cleanName, FL? Sweet Maid offers professional house cleaning, deep cleaning, and more. Licensed & Insured. Get a free quote today!"
    $keywords = "cleaning service $cleanName, house cleaning $cleanName, maid service $cleanName, deep cleaning $cleanName, move out cleaning $cleanName, residential cleaning $cleanName, eco-friendly cleaning $name"
    
    # Customize Content
    $localHeader = $sourceHeader -replace 'in Bradenton</span>', "in $cleanName</span>"
    $localFooter = $sourceFooter
    
    $localMain = $sourceMain
    $localMain = $localMain -replace "Bradenton’s", "$cleanName's" # Unified to standard quote
    $localMain = $localMain -replace "Bradenton's", "$cleanName's" 
    $localMain = $localMain -replace "Why Bradenton Trusts Us", "Why $cleanName Trusts Us"
    $localMain = $localMain -replace "Trusted by homeowners in Bradenton", "Trusted by homeowners in $cleanName"
    $localMain = $localMain -replace "across Bradenton and Southwest Florida", "across $cleanName and Southwest Florida"
    $localMain = $localMain -replace "in Bradenton home", "in $cleanName home"
    $localMain = $localMain -replace "Favorite Cleaners in Bradenton", "Favorite Cleaners in $cleanName"
    $localMain = $localMain -replace "Top Rated in Bradenton", "Top Rated in $cleanName"
    $localMain = $localMain -replace 'Bradenton%2C%20FL', ($cleanName -replace ' ', '+')
    
    # Surgical remainder replacement (avoiding Bradenton Beach overlap)
    $localMain = [regex]::Replace($localMain, '(?<!Bradenton\s)Bradenton(?! Beach)', $cleanName)

    # Link absolute parity
    $localMain = $localMain -replace 'index.html#contact', '#contact'
    $localMain = $localMain -replace 'index.html#home', '#home'
    $localMain = $localMain -replace 'index.html#about', '#about'


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
    [System.IO.File]::WriteAllText((Resolve-Path .).Path + "\$fileName", $pageHtml, $utf8NoBom)
}

Write-Host "Extreme SEO Parity Complete: 32 Location Pages fully localized and optimized."
