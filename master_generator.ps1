$sourceFile = "home/index.html"
$content = Get-Content $sourceFile -Raw -Encoding UTF8
$aboutTemplate = Get-Content "about/index.html" -Raw -Encoding UTF8
$galleryTemplate = Get-Content "gallery/index.html" -Raw -Encoding UTF8

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
# Corrected extraction logic for Mobile Menu
$menuStartComment = "<!-- Mobile Menu -->"
if ($content.Contains("<!-- Mobile Menu Expansion -->")) {
    $menuStartComment = "<!-- Mobile Menu Expansion -->"
}
$menuStartIdx = $content.IndexOf($menuStartComment)
$menuEndMatch = [regex]::Match($content, '(?s)<!-- ================================================\s+HERO')

if ($menuStartIdx -ge 0 -and $menuEndMatch.Success) {
    $sourceMenu = $content.Substring($menuStartIdx, $menuEndMatch.Index - $menuStartIdx).Trim()
} else { 
    Write-Warning "Could not find mobile menu markers accurately. Using fallback regex."
    $sourceMenu = "" 
}

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

$areaNames = "Bradenton", "Miami", "Anna Maria", "Foxleigh", "Palmer Ranch", "Lakewood Ranch", "Osprey", "University Park", "Laurel", "Sarasota", "Longboat Key", "Bradenton Beach", "Nokomis", "Siesta Key", "Fruitville", "Holmes Beach", "Whitfield", "Parrish", "Braden River", "Bee Ridge", "Bayshore Gardens", "Venice", "The Meadows", "Gulf Gate Estates", "South Gate", "Ellenton", "Sarasota Springs", "Lake Sarasota", "South Sarasota", "Palmetto", "Palma Sola", "Myakka", "Bird Key", "North Port", "South Venice", "Englewood", "Rotonda West", "Port Charlotte", "Ruskin", "Apollo Beach", "Terra Ceia", "Lido Key", "Vamo", "Sun City Center", "Arcadia"

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

# Define service slugs for link injection
$serviceSlugs = @(
    "house-cleaning", "deep-cleaning", "move-in-out-cleaning", "airbnb-cleaning", "commercial-cleaning",
    "post-construction-cleaning", "carpet-cleaning", "pressure-washing", "window-cleaning",
    "home-watch-services", "office-janitorial-services", "janitorial-cleaning-services",
    "medical-dental-facility-cleaning", "industrial-warehouse-cleaning", "floor-stripping-waxing",
    "gym-fitness-center-cleaning", "school-daycare-cleaning", "church-worship-center-cleaning",
    "property-management-janitorial", "luxury-estate-cleaning", "solar-panel-cleaning",
    "gutter-cleaning", "property-maintenance", "airbnb-vacation-rental-management",
    "luxury-estate-management"
)

foreach ($name in $areaNames) {
    $cleanName = if ($name -eq "Anna Maria") { "Anna Maria Island" } else { $name }
    $locSlug = $name.ToLower().Replace(" ", "-") + "-fl"
    $fileName = "$locSlug/index.html"
    
    $title = "Best House Cleaning Services in $cleanName, FL | Top Rated & Reliable"
    $desc = "Looking for the best house cleaning in $cleanName, FL? Sweet Maid provides top-rated, reliable, and affordable maid services. 100% Satisfaction Guaranteed. Book Now!"
    $keywords = "best house cleaning $cleanName, top rated maid service $cleanName, best cleaning services $cleanName, reliable house cleaners $cleanName, affordable maid service $cleanName"
    
    # Customize Header (Rated Service and Injected Links)
    $localHeader = [regex]::Replace($sourceHeader, '(?s)Rated Cleaning Service in\s+Bradenton</span>', "Rated Cleaning Service in $cleanName</span>")
    $localMenu = $sourceMenu

    # Inject Siloed Links into Header and Menu
    foreach ($svcSlug in $serviceSlugs) {
        $localHeader = $localHeader -replace "/$svcSlug/", "/$locSlug/$svcSlug/"
        $localMenu = $localMenu -replace "/$svcSlug/", "/$locSlug/$svcSlug/"
    }

    # Silo navigation links and logo within Header and Menu
    $localHeader = $localHeader -replace '"/home/"', "`"/$locSlug/`""
    $localHeader = $localHeader -replace '"/about/"', "`"/$locSlug/about/`""
    $localHeader = $localHeader -replace '"/gallery/"', "`"/$locSlug/gallery/`""
    
    $localMenu = $localMenu -replace '"/home/"', "`"/$locSlug/`""
    $localMenu = $localMenu -replace '"/about/"', "`"/$locSlug/about/`""
    $localMenu = $localMenu -replace '"/gallery/"', "`"/$locSlug/gallery/`""

    # Fix Area Navigation Links (rename -cleaning to -fl)
    $localHeader = $localHeader -replace "-cleaning/", "-fl/"
    $localMenu = $localMenu -replace "-cleaning/", "-fl/"

    # Customize Footer
    $localFooter = $sourceFooter

    # Customize Main Content
    $localMain = $sourceMain
    $localMain = $localMain -replace "Bradenton’s", "$cleanName's"
    $localMain = $localMain -replace "Bradenton's", "$cleanName's" 
    $localMain = $localMain -replace "across Bradenton and Southwest Florida", "across $cleanName and Southwest Florida"
    $localMain = $localMain -replace "in Bradenton home", "in $cleanName home"
    $localMain = $localMain -replace "Favorite Cleaners in Bradenton", "Favorite Cleaners in $cleanName"
    $localMain = $localMain -replace "Top Rated in Bradenton", "Top Rated in $cleanName"

    # Inject siloing links into main content cards/buttons
    foreach ($svcSlug in $serviceSlugs) {
        $localMain = $localMain -replace "/$svcSlug/", "/$locSlug/$svcSlug/"
    }

    $localFooter = $localFooter -replace '"/home/"', "`"/$locSlug/`""
    $localFooter = $localFooter -replace '"/about/"', "`"/$locSlug/about/`""
    $localFooter = $localFooter -replace '"/gallery/"', "`"/$locSlug/gallery/`""

    # Map Optimization
    $mapPb = "!1m18!1m12!1m3!1d113425.29828882585!2d-82.64501464999999!3d27.497495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2e663693aa661%3A0x628f8694032a1740!2s$($cleanName -replace ' ', '+')%2C+FL%2C+USA!5e0!3m2!1sen!2sus!4v1707520000000!5m2!1sen!2sus"
    if ($name -eq "Venice") {
        $mapPb = "!1m18!1m12!1m3!1d113643.08051786196!2d-82.49089947930467!3d27.391629853974495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c341399426f30d%3A0xc3b83c518b532924!2sVenice%2C+FL+34285%2C+USA!5e0!3m2!1sen!2sus!4v1739561081827!5m2!1sen!2sus"
    } elseif ($name -eq "University Park") {
        $mapPb = "!1m18!1m12!1m3!1d113643.08051786196!2d-82.49089947930467!3d27.391629853974495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c341399426f30d%3A0xc3b83c518b532924!2sUniversity+Park%2C+FL+34201%2C+USA!5e0!3m2!1sen!2sus!4v1739561081827!5m2!1sen!2sus"
    } elseif ($name -eq "Miami") {
        $mapPb = "!1m18!1m12!1m3!1d3592.518!2d-80.19179!3d25.76168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b0a5015b3c53%3A0xc074744040974837!2sMiami%2C+FL%2C+USA!5e0!3m2!1sen!2sus!4v1739561081827!5m2!1sen!2sus"
    }
    $localMain = $localMain -replace 'MAP_PLACEHOLDER', $mapPb

    # SEO Overhauls (H1 and Desc)
    $localMain = [regex]::Replace($localMain, '(?s)<h1.*?>.*?</h1>', @"
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-gray-900">
            Best Cleaning Services in <br>
            <span class="text-gradient">$cleanName, FL</span>
          </h1>
"@)

    $localMain = [regex]::Replace($localMain, '(?s)<p class="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">.*?</p>', @"
          <p class="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
            Leading house cleaning and professional maid services in $cleanName, FL. We bring the sparkle back to your $cleanName home.
          </p>
"@)

    # Path fix for images
    $localMain = $localMain -replace 'src="images/', 'src="../images/'
    $localMain = $localMain -replace 'url\("?images/', 'url("../images/'

    # Assemble Page
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
    <meta property="og:description" content="Professional, reliable, and friendly cleaning services for $cleanName and surrounding areas.">
    <meta property="og:image" content="https://i.ibb.co/QSD3Ydt/image.jpg">

    $sourceHead
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Sweet Maid Cleaning Service - $name",
      "image": "https://i.ibb.co/QSD3Ydt/image.jpg",
      "telephone": "(941) 222-2080",
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
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "150"
      }
    }
    </script>
</head>
<body class="antialiased">
    $localHeader
    $localMenu
    $localMain
    $localFooter
    $sourceScripts
</body>
</html>
"@
    
    $destDir = $locSlug
    if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
    [System.IO.File]::WriteAllText("$destDir/index.html", $pageHtml, $utf8NoBom)

    # 1.5 Generate About and Gallery Pages
    foreach ($pageType in @("about", "gallery")) {
        Write-Host "Generating Base Page: $locSlug/$pageType/index.html"
        
        $baseContent = if ($pageType -eq "about") { $aboutTemplate } else { $galleryTemplate }

        # Localize Header Top Bar
        $baseContent = [regex]::Replace($baseContent, '(?s)#1 Rated Cleaning Service in\s+Bradenton</span>', "#1 Rated Cleaning Service in $cleanName</span>")
        
        # We leave the generic "We Serve 32+" menu sections alone here as there's no localized array setup in the master generator 
        # But we DO need to silo the active paths:
        foreach ($svcSlug in $serviceSlugs) {
            $baseContent = $baseContent -replace "/$svcSlug/", "/$locSlug/$svcSlug/"
        }
        
        $baseContent = $baseContent -replace '"/home/"', "`"/$locSlug/`""
        $baseContent = $baseContent -replace '"/about/"', "`"/$locSlug/about/`""
        $baseContent = $baseContent -replace '"/gallery/"', "`"/$locSlug/gallery/`""

        # SEO Overhaul for Base Pages
        $pageTitleCap = (Get-Culture).TextInfo.ToTitleCase($pageType)
        $baseContent = $baseContent -replace '(?s)<title>.*?</title>', "<title>#1 Rated Cleaning Service $pageTitleCap in $cleanName, FL | Sweet Maid Cleaning</title>"
        $baseContent = $baseContent -replace '(?s)<meta name="description".*?>', "<meta name=""description"" content=""Learn more $pageType our top-rated luxury cleaning services in $cleanName, FL. Guaranteed satisfaction!"" />"
        $baseContent = $baseContent -replace '<link rel="canonical" href=".*?" />', "<link rel=""canonical"" href=""https://sweetmaidcleaning.com/$locSlug/$pageType/"" />"
        
        # OG Fixes
        $baseContent = $baseContent -replace '<meta property="og:url" content=".*?"', "<meta property=""og:url"" content=""https://sweetmaidcleaning.com/$locSlug/$pageType/"""
        $baseContent = $baseContent -replace '<meta property="og:title" content=".*?"', "<meta property=""og:title"" content=""#1 Rated Cleaning Service $pageTitleCap in $cleanName, FL"""
        
        # Localize mentions
        $baseContent = $baseContent -replace "Bradenton’s", "$cleanName's"
        $baseContent = $baseContent -replace "Bradenton's", "$cleanName's"
        $baseContent = $baseContent -replace "across Bradenton and Southwest Florida", "across $cleanName and Southwest Florida"
        $baseContent = $baseContent -replace "in Bradenton, FL", "in $cleanName, FL"
        $baseContent = $baseContent -replace '"name": "Bradenton, FL"', "`"name`": `"$cleanName, FL`""
        $baseContent = $baseContent -replace '"addressLocality": "Bradenton"', "`"addressLocality`": `"$cleanName`""
        
        # Fix Image Paths
        $baseContent = $baseContent -replace 'src="../images/', 'src="../../images/'
        $baseContent = $baseContent -replace 'url\("?\.\./images/', 'url("../../images/'
        $baseContent = $baseContent -replace 'src="/images/', 'src="../../images/'

        $baseDir = "$locSlug/$pageType"
        if (!(Test-Path $baseDir)) { New-Item -ItemType Directory -Path $baseDir -Force | Out-Null }
        [System.IO.File]::WriteAllText("$baseDir/index.html", $baseContent, $utf8NoBom)
    }
}

Write-Host "Site Silo Restructuring Complete: $($areaNames.Count) City Hubs generated."
