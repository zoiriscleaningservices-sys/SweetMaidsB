$sourceFile = "index.html"
$content = Get-Content $sourceFile -Raw

if ($null -eq $content -or $content.Length -lt 100) {
    Write-Error "Could not read index.html"
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
$menuStartIdx = $content.IndexOf("<!-- Mobile Menu -->")
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

$areaNames = "Bradenton", "Anna Maria", "Fosleight", "Palmer Ranch", "Lakewood Ranch", "Osprey", "University Park", "Laurel", "Sarasota", "Longboat Key", "Bradenton Beach", "Nokomis", "Siesta Key", "Fruitville", "Holmes Beach", "Whitfield", "Parrish", "Braden River", "Bee Ridge", "Bayshore Gardens", "Venice", "The Meadows", "Gulf Gate Estates", "South Gate", "Ellenton", "Sarasota Springs", "Lake Sarasota", "South Sarasota", "Palmetto", "Palma Sola", "Myakka", "Bird Key"

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($name in $areaNames) {
    $cleanName = if ($name -eq "Anna Maria") { "Anna Maria Island" } else { $name }
    $fileName = $name.ToLower().Replace(" ", "-") + "-cleaning.html"
    
    $title = "Sweet Maid Cleaning Service - #1 Rated House Cleaning in $cleanName, FL"
    $desc = "Looking for top-rated cleaning services in $cleanName, FL? Sweet Maid offers professional house cleaning, deep cleaning, and more. Licensed & Insured. Get a free quote today!"
    $keywords = "cleaning service $cleanName, house cleaning $cleanName, maid service $cleanName, deep cleaning $cleanName, move out cleaning $cleanName, residential cleaning $cleanName, eco-friendly cleaning $name"
    
    # Customize Content
    $localHeader = $sourceHeader -replace 'in Bradenton</span>', "in $cleanName</span>"
    
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
    
    # Link absolute parity
    $localMain = $localMain -replace 'index.html#contact', '#contact'
    $localMain = $localMain -replace 'index.html#home', '#home'
    $localMain = $localMain -replace 'index.html#about', '#about'

    $localFooter = $sourceFooter -replace "Made with love in Bradenton", "Made with love in $cleanName"

    # Surgical remainder replacement (avoiding Bradenton Beach overlap)
    $localMain = [regex]::Replace($localMain, '(?<!Bradenton\s)Bradenton(?! Beach)', $name)

    # Extreme Alt Tag Localization
    # 1. Replace existing "Bradenton" in alts
    $localMain = [regex]::Replace($localMain, 'alt="([^"]*?)Bradenton([^"]*?)"', 'alt="$1' + $cleanName + '$2"')
    
    # 2. Append " in City" to generic alts that don't have the city name yet
    # We use a negative lookahead to ensure we don't double up
    $pattern = 'alt="([^"]*?)(?<!' + [regex]::Escape($cleanName) + ')"' 
    # This is tricky with regex in PS. Let's do a simpler approach: 
    # Find all alts, check if they contain the city. If not, append it.
    
    $localMain = [regex]::Replace($localMain, 'alt="([^"]+?)"', { 
        param($match) 
        $currentAlt = $match.Groups[1].Value
        if ($currentAlt -notmatch $cleanName) {
            return 'alt="' + $currentAlt + ' in ' + $cleanName + '"'
        }
        return $match.Value
    })

    # FAQ Section Injection
    $faqSection = @"
    <section class="py-16 bg-pink-50">
        <div class="max-w-4xl mx-auto px-6">
            <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Common Questions about Cleaning in $cleanName</h2>
            <div class="space-y-6">
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <h3 class="font-bold text-lg text-gray-900 mb-2">Do you offer cleaning services in $name?</h3>
                    <p class="text-gray-600">Yes! We are proud to serve $name and the surrounding neighborhoods with our top-rated house cleaning, deep cleaning, and maid services.</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <h3 class="font-bold text-lg text-gray-900 mb-2">Are your cleaners in $name insured?</h3>
                    <p class="text-gray-600">Absolutely. Every member of our $name cleaning team is fully background-checked, licensed, and insured for your peace of mind.</p>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <h3 class="font-bold text-lg text-gray-900 mb-2">Can I get a same-day quote for my home in $name?</h3>
                    <p class="text-gray-600">Yes, we offer fast, free quotes for all $name residents. Simply fill out our online form or give us a call to get started.</p>
                </div>
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
    <link rel="canonical" href="https://sweetmaidcleaning.com/$fileName" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://sweetmaidcleaning.com/$fileName">
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
      "telephone": "941-222-2080",
      "email": "info@sweetmaidcleaning.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "$name",
        "addressRegion": "FL",
        "addressCountry": "US"
      },
      "url": "https://sweetmaidcleaning.com/$fileName",
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
    $faqSection
    $localFooter
    $sourceScripts
</body>
</html>
"@
    [System.IO.File]::WriteAllText((Resolve-Path .).Path + "\$fileName", $pageHtml, $utf8NoBom)
}

Write-Host "Extreme SEO Parity Complete: 32 Location Pages fully localized and optimized."
