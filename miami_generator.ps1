$locations = @(
    "Miami", "Coral Gables", "Coconut Grove", "Pinecrest", "Brickell", "Bal Harbour", 
    "Sunny Isles Beach", "Key Biscayne", "Fisher Island", "Star Island", 
    "Palm Island", "Hibiscus Island", "South of Fifth", "Golden Beach", 
    "Gables Estates", "Indian Creek", "Miami Beach", "North Bay Village", 
    "Bay Harbor Islands", "Aventura", "Williams Island", "Surfside", 
    "Venetian Islands", "La Gorce Island", "Sunset Islands", "Allison Island", 
    "Belle Meade", "Morningside", "Bay Point", "Belle Isle", "Mid Beach", 
    "North Beach", "Normandy Isles", "Eastern Shores", "Keystone Point", 
    "Sans Souci Estates", "Porto Vita", "Island Estates", "Turnberry Isle", 
    "Palmetto Bay", "Old Cutler Bay", "Snapper Creek", "Hammock Oaks", 
    "Journey's End", "Deering Bay", "Gables by the Sea", "Cocoplum", 
    "Tahiti Beach", "Miami Shores", "El Portal", "Biscayne Park", 
    "The Roads", "Silver Bluff", "Shenandoah", "Brickell Key", "Ponce-Davis", 
    "High Pines"
)

$services = @(
    @{ slug = "house-cleaning"; name = "House Cleaning" },
    @{ slug = "deep-cleaning"; name = "Deep Cleaning" },
    @{ slug = "move-in-out-cleaning"; name = "Move In/Out Cleaning" },
    @{ slug = "airbnb-cleaning"; name = "Airbnb Cleaning" },
    @{ slug = "commercial-cleaning"; name = "Commercial Cleaning" },
    @{ slug = "post-construction-cleaning"; name = "Post-Construction Cleaning" },
    @{ slug = "carpet-cleaning"; name = "Carpet Cleaning" },
    @{ slug = "pressure-washing"; name = "Pressure Washing" },
    @{ slug = "window-cleaning"; name = "Window Cleaning" },
    @{ slug = "home-watch-services"; name = "Home Watch Services" },
    @{ slug = "office-janitorial-services"; name = "Office Janitorial Services" },
    @{ slug = "janitorial-cleaning-services"; name = "Janitorial Cleaning Services" },
    @{ slug = "medical-dental-facility-cleaning"; name = "Medical & Dental Facility Cleaning" },
    @{ slug = "industrial-warehouse-cleaning"; name = "Industrial & Warehouse Cleaning" },
    @{ slug = "floor-stripping-waxing"; name = "Floor Stripping & Waxing" },
    @{ slug = "gym-fitness-center-cleaning"; name = "Gym & Fitness Center Cleaning" },
    @{ slug = "school-daycare-cleaning"; name = "School & Daycare Cleaning" },
    @{ slug = "church-worship-center-cleaning"; name = "Church & Worship Center Cleaning" },
    @{ slug = "property-management-janitorial"; name = "Property Management Janitorial" },
    @{ slug = "luxury-estate-cleaning"; name = "Luxury Estate Cleaning" },
    @{ slug = "solar-panel-cleaning"; name = "Solar Panel Cleaning" },
    @{ slug = "gutter-cleaning"; name = "Gutter Cleaning" },
    @{ slug = "property-maintenance"; name = "Property Maintenance" },
    @{ slug = "airbnb-vacation-rental-management"; name = "Airbnb & Vacation Rental Management" },
    @{ slug = "luxury-estate-management"; name = "Luxury Estate Management" }
)

$serviceSlugs = $services.slug

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

# Create the Siloed Location Links for Header/Footer
$miamiLinksHeader = ""
$miamiLinksMobile = ""
$miamiLinksFooter = ""

foreach ($loc in $locations) {
    $locSlug = $loc.ToLower().Replace(" ", "-") + "-fl"
    $miamiLinksHeader += "<a href=""/$locSlug/"" class=""block px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-50 text-gray-700 hover:text-pink-300 font-medium text-xs transition"">$loc</a>`n"
    $miamiLinksMobile += "<a href=""/$locSlug/"" class=""mobile-link py-2 text-sm text-gray-600 hover:text-pink-400"">$loc</a>`n"
    $miamiLinksFooter += "<a href=""/$locSlug/"" class=""hover:text-pink-400 transition-colors"">$loc</a>`n"
}

# Templates for Location Silo Pages
$hubTemplate = Get-Content "home/index.html" -Raw -Encoding UTF8
$aboutTemplate = Get-Content "about/index.html" -Raw -Encoding UTF8
$galleryTemplate = Get-Content "gallery/index.html" -Raw -Encoding UTF8

foreach ($loc in $locations) {
    $locSlug = $loc.ToLower().Replace(" ", "-") + "-fl"
    $cleanLoc = $loc
    
    # 1. Generate Hub Page
    Write-Host "Generating Hub: $locSlug/index.html"
    $content = $hubTemplate
    
    # Localize Header Top Bar
    $content = [regex]::Replace($content, '(?s)#1 Rated Cleaning Service in\s+Bradenton</span>', "#1 Rated Cleaning Service in $cleanLoc</span>")
    
    # Replace Service Areas in Desktop Header
    $content = [regex]::Replace($content, '(?s)<div class="text-xs font-bold text-pink-300 uppercase tracking-wider px-4 py-2 mb-2">We Serve 32\+.*?</div>\s*<div class="grid grid-cols-2 gap-1">.*?</div>', @"
<div class="text-xs font-bold text-pink-300 uppercase tracking-wider px-4 py-2 mb-2">Miami Service Areas</div>
<div class="grid grid-cols-2 gap-1">
$miamiLinksHeader
</div>
"@)

    # Replace Service Areas in Mobile Menu
    $content = [regex]::Replace($content, '(?s)<div class="accordion-content">\s*<div class="grid grid-cols-2 gap-x-4 gap-y-1 p-4 mt-1 bg-pink-50/30 rounded-2xl border border-pink-100/50">.*?</div>', @"
<div class="accordion-content">
<div class="grid grid-cols-2 gap-x-4 gap-y-1 p-4 mt-1 bg-pink-50/30 rounded-2xl border border-pink-100/50">
$miamiLinksMobile
</div>
"@)

    # Replace Service Areas in Footer
    $content = [regex]::Replace($content, '(?s)<div class="lg:col-span-2">\s*<h4 class="text-gray-800 font-bold text-lg mb-6 flex items-center gap-2">.*?</h4>\s*<div class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs">.*?</div>\s*</div>', @"
<div class="lg:col-span-2">
<h4 class="text-gray-800 font-bold text-lg mb-6 flex items-center gap-2">
<span class="w-1 h-6 bg-pink-300 rounded-full"></span>Miami Service Areas
</h4>
<div class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs">
$miamiLinksFooter
</div>
</div>
"@)

    # Silo all service links on the hub page
    foreach ($svcSlug in $serviceSlugs) {
        $content = $content -replace "/$svcSlug/", "/$locSlug/$svcSlug/"
    }

    # Silo navigation links and logo
    $content = $content -replace '"/home/"', "`"/$locSlug/`""
    $content = $content -replace '"/about/"', "`"/$locSlug/about/`""
    $content = $content -replace '"/gallery/"', "`"/$locSlug/gallery/`""

    # SEO Overhaul for Hub
    $content = $content -replace '(?s)<title>.*?</title>', "<title>#1 Rated Cleaning Service in $cleanLoc, FL | Sweet Maid Cleaning</title>"
    $content = $content -replace '(?s)<meta name="description".*?>', "<meta name=""description"" content=""Looking for the best cleaning service in $cleanLoc, FL? Sweet Maid offers top-rated luxury house cleaning, deep cleaning, and move-out services in Miami. Licensed, insured, and 100% satisfaction guaranteed. Book your sparkle today!"" />"
    $content = $content -replace '<link rel="canonical" href=".*?" />', "<link rel=""canonical"" href=""https://sweetmaidcleaning.com/$locSlug/"" />"
    
    # OG Fixes
    $content = $content -replace '<meta property="og:url" content=".*?"', "<meta property=""og:url"" content=""https://sweetmaidcleaning.com/$locSlug/"""
    $content = $content -replace '<meta property="og:title" content=".*?"', "<meta property=""og:title"" content=""#1 Rated Cleaning Service in $cleanLoc, FL | Sweet Maid Cleaning"""
    $content = $content -replace '<meta property="og:description" content=".*?"', "<meta property=""og:description"" content=""Looking for the best cleaning service in $cleanLoc, FL? Sweet Maid offers top-rated luxury cleaning in Miami's finest neighborhoods."""

    # Schema Extreme SEO
    $content = $content -replace "Sweet Maid Cleaning Service - Bradenton", "Sweet Maid Cleaning of $cleanLoc"
    $content = $content -replace '"addressLocality": "Bradenton"', "`"addressLocality`": `"$cleanLoc`""
    $content = $content -replace '"name": "Bradenton, FL"', "`"name`": `"$cleanLoc, FL`""
    $content = $content -replace 'Sweet Maid is widely considered the #1 rated cleaning service in Bradenton, FL', "Sweet Maid is widely considered the #1 rated cleaning service in $cleanLoc, FL"
    $content = $content -replace 'Cleaning costs in Bradenton vary', "Cleaning costs in $cleanLoc vary"
    $content = $content -replace '"latitude": "27.4989"', '"latitude": "25.7617"'
    $content = $content -replace '"longitude": "-82.5748"', '"longitude": "-80.1918"'

    # H1 and Hero Desc
    $content = [regex]::Replace($content, '(?s)<h1.*?>.*?</h1>', @"
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-gray-900">
            Best Cleaning Services in <br>
            <span class="text-gradient">$cleanLoc, FL</span>
          </h1>
"@)
    $content = [regex]::Replace($content, '(?s)<p class="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">.*?</p>', @"
          <p class="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
            Miami's most trusted luxury cleaning service arrives in $cleanLoc. We bring the sparkle back to your $cleanLoc home so you can focus on the vibrant Miami lifestyle.
          </p>
"@)

    # Localize "Bradenton" mentions
    $content = $content -replace "Bradenton’s", "$cleanLoc's"
    $content = $content -replace "Bradenton's", "$cleanLoc's"
    $content = $content -replace "across Bradenton and Southwest Florida", "across $cleanLoc and the Miami area"
    $content = $content -replace "Bradenton home", "$cleanLoc home"

    # Fix image paths (one level deep)
    $content = $content -replace 'src="images/', 'src="../images/'
    $content = $content -replace 'url\("?images/', 'url("../images/'

    # MAP Optimization
    $mapPb = "!1m18!1m12!1m3!1d3592.518!2d-80.19179!3d25.76168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b0a5015b3c53%3A0xc074744040974837!2s$($loc -replace ' ', '+')%2C+FL%2C+USA!5e0!3m2!1sen!2sus!4v1739561081827!5m2!1sen!2sus"
    $content = $content -replace 'MAP_PLACEHOLDER', $mapPb

    # Save Hub
    $destDir = $locSlug
    if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
    [System.IO.File]::WriteAllText("$destDir/index.html", $content, $utf8NoBom)

    # 1.5 Generate About and Gallery Pages
    foreach ($pageType in @("about", "gallery")) {
        Write-Host "Generating Base Page: $locSlug/$pageType/index.html"
        
        $baseContent = if ($pageType -eq "about") { $aboutTemplate } else { $galleryTemplate }

        # Localize Header Top Bar
        $baseContent = [regex]::Replace($baseContent, '(?s)#1 Rated Cleaning Service in\s+Bradenton</span>', "#1 Rated Cleaning Service in $cleanLoc</span>")
        
        # Replace Service Areas in Desktop Header
        $baseContent = [regex]::Replace($baseContent, '(?s)<div class="text-xs font-bold text-pink-300 uppercase tracking-wider px-4 py-2 mb-2">We Serve 32\+.*?</div>\s*<div class="grid grid-cols-2 gap-1">.*?</div>', @"
<div class="text-xs font-bold text-pink-300 uppercase tracking-wider px-4 py-2 mb-2">Miami Service Areas</div>
<div class="grid grid-cols-2 gap-1">
$miamiLinksHeader
</div>
"@)

        # Replace Service Areas in Mobile Menu
        $baseContent = [regex]::Replace($baseContent, '(?s)<div class="accordion-content">\s*<div class="grid grid-cols-2 gap-x-4 gap-y-1 p-4 mt-1 bg-pink-50/30 rounded-2xl border border-pink-100/50">.*?</div>', @"
<div class="accordion-content">
<div class="grid grid-cols-2 gap-x-4 gap-y-1 p-4 mt-1 bg-pink-50/30 rounded-2xl border border-pink-100/50">
$miamiLinksMobile
</div>
"@)

        # Replace Service Areas in Footer
        $baseContent = [regex]::Replace($baseContent, '(?s)<div class="lg:col-span-2">\s*<h4 class="text-gray-800 font-bold text-lg mb-6 flex items-center gap-2">.*?</h4>\s*<div class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs">.*?</div>\s*</div>', @"
<div class="lg:col-span-2">
<h4 class="text-gray-800 font-bold text-lg mb-6 flex items-center gap-2">
<span class="w-1 h-6 bg-pink-300 rounded-full"></span>Miami Service Areas
</h4>
<div class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs">
$miamiLinksFooter
</div>
</div>
"@)

        # Silo all service links
        foreach ($svcSlug in $serviceSlugs) {
            $baseContent = $baseContent -replace "/$svcSlug/", "/$locSlug/$svcSlug/"
        }

        # Silo navigation links and logo
        $baseContent = $baseContent -replace '"/home/"', "`"/$locSlug/`""
        $baseContent = $baseContent -replace '"/about/"', "`"/$locSlug/about/`""
        $baseContent = $baseContent -replace '"/gallery/"', "`"/$locSlug/gallery/`""

        # SEO Overhaul for Base Pages
        $pageTitleCap = (Get-Culture).TextInfo.ToTitleCase($pageType)
        $baseContent = $baseContent -replace '(?s)<title>.*?</title>', "<title>#1 Rated Cleaning Service $pageTitleCap in $cleanLoc, FL | Sweet Maid Cleaning</title>"
        $baseContent = $baseContent -replace '(?s)<meta name="description".*?>', "<meta name=""description"" content=""Learn more $pageType our top-rated luxury cleaning services in $cleanLoc, FL. Guaranteed satisfaction!"" />"
        $baseContent = $baseContent -replace '<link rel="canonical" href=".*?" />', "<link rel=""canonical"" href=""https://sweetmaidcleaning.com/$locSlug/$pageType/"" />"
        
        # OG Fixes
        $baseContent = $baseContent -replace '<meta property="og:url" content=".*?"', "<meta property=""og:url"" content=""https://sweetmaidcleaning.com/$locSlug/$pageType/"""
        $baseContent = $baseContent -replace '<meta property="og:title" content=".*?"', "<meta property=""og:title"" content=""#1 Rated Cleaning Service $pageTitleCap in $cleanLoc, FL"""
        
        # Localize mentions
        $baseContent = $baseContent -replace "Bradenton’s", "$cleanLoc's"
        $baseContent = $baseContent -replace "Bradenton's", "$cleanLoc's"
        $baseContent = $baseContent -replace "across Bradenton and Southwest Florida", "across $cleanLoc and the Miami area"
        $baseContent = $baseContent -replace "in Bradenton, FL", "in $cleanLoc, FL"
        $baseContent = $baseContent -replace '"name": "Bradenton, FL"', "`"name`": `"$cleanLoc, FL`""
        $baseContent = $baseContent -replace '"addressLocality": "Bradenton"', "`"addressLocality`": `"$cleanLoc`""
        $baseContent = $baseContent -replace '"latitude": "27.4989"', '"latitude": "25.7617"'
        $baseContent = $baseContent -replace '"longitude": "-82.5748"', '"longitude": "-80.1918"'

        # Fix image paths (two levels deep)
        $baseContent = $baseContent -replace 'src="../images/', 'src="../../images/'
        $baseContent = $baseContent -replace 'url\("?\.\./images/', 'url("../../images/'
        
        # Fallback for root image paths if any
        $baseContent = $baseContent -replace 'src="/images/', 'src="../../images/'

        $baseDir = "$locSlug/$pageType"
        if (!(Test-Path $baseDir)) { New-Item -ItemType Directory -Path $baseDir -Force | Out-Null }
        [System.IO.File]::WriteAllText("$baseDir/index.html", $baseContent, $utf8NoBom)
    }

    # 2. Generate Service Pages
    foreach ($svc in $services) {
        $svcSlug = $svc.slug
        $svcName = $svc.name
        $sourceFile = "$svcSlug/index.html"
        $destSvcDir = "$locSlug/$svcSlug"
        $destSvcFile = "$destSvcDir/index.html"

        if (Test-Path $sourceFile) {
            Write-Host "Generating Service: $destSvcFile"
            if (!(Test-Path $destSvcDir)) { New-Item -ItemType Directory -Path $destSvcDir -Force | Out-Null }
            
            $svcContent = Get-Content $sourceFile -Raw -Encoding UTF8
            
            # Localize Header Top Bar
            $svcContent = [regex]::Replace($svcContent, '(?s)#1 Rated Cleaning Service in\s+Bradenton</span>', "#1 Rated Cleaning Service in $cleanLoc</span>")

            # Replace Service Areas in Desktop Header
            $svcContent = [regex]::Replace($svcContent, '(?s)<div class="text-xs font-bold text-pink-300 uppercase tracking-wider px-4 py-2 mb-2">We Serve 32\+.*?</div>\s*<div class="grid grid-cols-2 gap-1">.*?</div>', @"
<div class="text-xs font-bold text-pink-300 uppercase tracking-wider px-4 py-2 mb-2">Miami Service Areas</div>
<div class="grid grid-cols-2 gap-1">
$miamiLinksHeader
</div>
"@)

            # Replace Service Areas in Mobile Menu
            $svcContent = [regex]::Replace($svcContent, '(?s)<div class="accordion-content">\s*<div class="grid grid-cols-2 gap-x-4 gap-y-1 p-4 mt-1 bg-pink-50/30 rounded-2xl border border-pink-100/50">.*?</div>', @"
<div class="accordion-content">
<div class="grid grid-cols-2 gap-x-4 gap-y-1 p-4 mt-1 bg-pink-50/30 rounded-2xl border border-pink-100/50">
$miamiLinksMobile
</div>
"@)

            # Replace Service Areas in Footer
            $svcContent = [regex]::Replace($svcContent, '(?s)<div class="lg:col-span-2">\s*<h4 class="text-gray-800 font-bold text-lg mb-6 flex items-center gap-2">.*?</h4>\s*<div class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs">.*?</div>\s*</div>', @"
<div class="lg:col-span-2">
<h4 class="text-gray-800 font-bold text-lg mb-6 flex items-center gap-2">
<span class="w-1 h-6 bg-pink-300 rounded-full"></span>Miami Service Areas
</h4>
<div class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs">
$miamiLinksFooter
</div>
</div>
"@)

            # Silo Service Links
            foreach ($sSlug in $serviceSlugs) {
                $svcContent = $svcContent -replace "/$sSlug/", "/$locSlug/$sSlug/"
            }

            # Silo navigation links and logo
            $svcContent = $svcContent -replace '"/home/"', "`"/$locSlug/`""
            $svcContent = $svcContent -replace '"/about/"', "`"/$locSlug/about/`""
            $svcContent = $svcContent -replace '"/gallery/"', "`"/$locSlug/gallery/`""

            # SEO Overhaul for Service Page
            $svcContent = $svcContent -replace '(?s)<title>.*?</title>', "<title>Best $svcName in $cleanLoc, FL | Sweet Maid Cleaning</title>"
            $svcContent = $svcContent -replace '(?s)<meta name="description".*?>', "<meta name=""description"" content=""Need the best $svcName in $cleanLoc, FL? Sweet Maid offers expert, luxury cleaning services in the Miami area. Licensed & Insured. 100% Guaranteed. Get a Quote!"" />"
            $svcContent = $svcContent -replace '<link rel="canonical" href=".*?" />', "<link rel=""canonical"" href=""https://sweetmaidcleaning.com/$locSlug/$svcSlug/"" />"

            # OG Fixes
            $svcContent = $svcContent -replace '<meta property="og:url" content=".*?"', "<meta property=""og:url"" content=""https://sweetmaidcleaning.com/$locSlug/$svcSlug/"""
            $svcContent = $svcContent -replace '<meta property="og:title" content=".*?"', "<meta property=""og:title"" content=""Best $svcName in $cleanLoc, FL | Sweet Maid Cleaning"""
            $svcContent = $svcContent -replace '<meta property="og:description" content=".*?"', "<meta property=""og:description"" content=""Need professional $svcName in $cleanLoc? Sweet Maid offers top-rated luxury services across Miami's finest enclaves."""

            # Schema Extreme SEO
            $svcContent = $svcContent -replace "Sweet Maid Cleaning Service - Bradenton", "Sweet Maid Cleaning of $cleanLoc"
            $svcContent = $svcContent -replace '"addressLocality": "Bradenton"', "`"addressLocality`": `"$cleanLoc`""
            $svcContent = $svcContent -replace '"name": "Bradenton, FL"', "`"name`": `"$cleanLoc, FL`""
            $svcContent = $svcContent -replace 'Sweet Maid is widely considered the #1 rated cleaning service in Bradenton, FL', "Sweet Maid is widely considered the #1 rated cleaning service in $cleanLoc, FL"
            $svcContent = $svcContent -replace 'Cleaning costs in Bradenton vary', "Cleaning costs in $cleanLoc vary"
            $svcContent = $svcContent -replace '"latitude": "27.4989"', '"latitude": "25.7617"'
            $svcContent = $svcContent -replace '"longitude": "-82.5748"', '"longitude": "-80.1918"'

            # H1
            $svcContent = [regex]::Replace($svcContent, '(?s)<h1.*?>.*?</h1>', @"
            <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-gray-900">
                $svcName in <br><span class="text-gradient">$cleanLoc, FL</span>
            </h1>
"@)

            # Mentions
            $svcContent = $svcContent -replace "Bradenton’s", "$cleanLoc's"
            $svcContent = $svcContent -replace "Bradenton's", "$cleanLoc's"
            $svcContent = $svcContent -replace "across Bradenton and Southwest Florida", "across $cleanLoc and the Miami area"
            $svcContent = $svcContent -replace "Bradenton home", "$cleanLoc home"

            # Image Paths (Two levels deep)
            $svcContent = $svcContent.Replace('src="../images/', 'src="../../images/')
            $svcContent = $svcContent.Replace('url("../images/', 'url("../../images/')
            
            # Map
            $svcContent = $svcContent -replace 'MAP_PLACEHOLDER', $mapPb

            # Save Service Page
            [System.IO.File]::WriteAllText("$destSvcFile", $svcContent, $utf8NoBom)
        }
    }
}

Write-Host "Miami Expansion Complete (with Total Schema SEO)!"
