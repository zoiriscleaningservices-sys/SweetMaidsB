$locations = @(
    "Bradenton", "Miami", "Anna Maria", "Foxleigh", "Palmer Ranch", "Lakewood Ranch", "Osprey", "University Park", "Laurel", 
    "Sarasota", "Longboat Key", "Bradenton Beach", "Nokomis", "Siesta Key", "Fruitville", "Holmes Beach", 
    "Whitfield", "Parrish", "Braden River", "Bee Ridge", "Bayshore Gardens", "Venice", "The Meadows", 
    "Gulf Gate Estates", "South Gate", "Ellenton", "Sarasota Springs", "Lake Sarasota", "South Sarasota", 
    "Palmetto", "Palma Sola", "Myakka", "Bird Key",
    "North Port", "South Venice", "Englewood", "Rotonda West", "Port Charlotte", "Ruskin", 
    "Apollo Beach", "Terra Ceia", "Lido Key", "Vamo", "Sun City Center", "Arcadia"
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

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

# SERVICE-SPECIFIC HERO IMAGE MAPPING
$serviceImageMap = @{
    "house-cleaning" = "https://i.ibb.co/QSD3Ydt/image.jpg"
    "deep-cleaning" = "../../images/whatsapp-image-2026-02-10-at-11.18.07-pm-1.jpeg"
    "move-in-out-cleaning" = "../../images/whatsapp-image-2026-02-10-at-11.18.08-pm-3.jpeg"
    "airbnb-cleaning" = "../../images/whatsapp-image-2026-02-10-at-11.17.59-pm.jpeg"
    "commercial-cleaning" = "../../images/whatsapp-image-2026-02-10-at-3.46.50-pm.jpeg"
    "post-construction-cleaning" = "../../images/whatsapp-image-2026-02-11-at-12.07.26-pm.jpeg"
    "carpet-cleaning" = "../../images/whatsapp-image-2026-02-10-at-11.18.09-pm-1.jpeg"
    "pressure-washing" = "../../images/whatsapp-image-2026-02-10-at-11.17.58-pm.jpeg"
    "window-cleaning" = "../../images/whatsapp-image-2026-02-10-at-11.18.08-pm.jpeg"
}

# EXTREME SEO H1 MAPPING
$serviceH1Map = @{
    "house-cleaning" = "House Cleaning Services in {LOCATION}, FL"
    "deep-cleaning" = "Deep House Cleaning in {LOCATION}, FL"
    "window-cleaning" = "Professional Window Cleaning in {LOCATION}, FL"
    "carpet-cleaning" = "Carpet & Rug Cleaning in {LOCATION}, FL"
    "pressure-washing" = "Pressure Washing Services in {LOCATION}, FL"
    "move-in-out-cleaning" = "Move In & Move Out Cleaning in {LOCATION}, FL"
    "airbnb-cleaning" = "Airbnb & Vacation Rental Cleaning in {LOCATION}, FL"
    "commercial-cleaning" = "Commercial & Office Cleaning in {LOCATION}, FL"
    "post-construction-cleaning" = "Post-Construction Cleaning in {LOCATION}, FL"
}

# KEYWORD-RICH HERO DESCRIPTIONS
$serviceDescMap = @{
    "house-cleaning" = "Top-rated house cleaning and professional maid services in {LOCATION}, FL. 100% Satisfaction Guaranteed."
    "deep-cleaning" = "Detailed deep cleaning services to reset your {LOCATION} home. Every corner cleaned, every surface sanitized."
    "window-cleaning" = "Crystal-clear, streak-free window cleaning for homes and businesses in {LOCATION}, FL."
    "carpet-cleaning" = "Professional carpet steam cleaning and stain removal experts serving the {LOCATION} area."
    "pressure-washing" = "Expert pressure washing for driveways, patios, and exteriors in {LOCATION}, FL."
    "move-in-out-cleaning" = "Stress-free move-in and move-out cleaning services in {LOCATION} to help you get your deposit back."
    "airbnb-cleaning" = "Fast, reliable Airbnb turnovers and vacation rental cleaning services in {LOCATION}, FL."
    "commercial-cleaning" = "Professional office cleaning and janitorial services tailored for businesses in {LOCATION}."
    "post-construction-cleaning" = "Comprehensive post-construction cleaning to remove dust and debris after your {LOCATION} renovation."
}

foreach ($loc in $locations) {
    $cleanLoc = if ($loc -eq "Anna Maria") { "Anna Maria Island" } else { $loc }
    $locSlug = $loc.ToLower().Replace(" ", "-") + "-fl"
    
    foreach ($svc in $services) {
        $svcSlug = $svc.slug
        $svcName = $svc.name
        $sourceFile = "$svcSlug/index.html"
        $destDir = "$locSlug/$svcSlug"
        $destFile = "$destDir/index.html"
        
        if (Test-Path $sourceFile) {
            Write-Host "Generating: $destFile"
            if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
            
            $content = Get-Content $sourceFile -Raw -Encoding UTF8
            
            # Inject Siloed Links into ALL content (Header, Menu, Body)
            foreach ($sSlug in $serviceSlugs) {
                $content = $content -replace "/$sSlug/", "/$locSlug/$sSlug/"
            }

            # Fix Area Navigation Links (rename -cleaning to -fl) in all content
            $content = $content -replace "-cleaning/", "-fl/"

            # Localize Header (Rated Service)
            $content = [regex]::Replace($content, '(?s)Rated Cleaning Service in\s+Bradenton</span>', "Rated Cleaning Service in $cleanLoc</span>")
            
            # 1. Localize Titles and Metas
            $content = $content -replace '(?s)<title>.*?</title>', "<title>Best $svcName in $cleanLoc, FL | Top Rated & Reliable Service</title>"
            $content = $content -replace '(?s)<meta name="description".*?>', "<meta name=""description"" content=""Need the best $svcName in $cleanLoc, FL? Sweet Maid offers expert, affordable, and top-rated cleaning services. Licensed & Insured. 100% Guaranteed. Get a Quote!"" />"
            
            # SEO H1 Overhaul
            $seoH1 = if ($serviceH1Map.ContainsKey($svcSlug)) { $serviceH1Map[$svcSlug] -replace '\{LOCATION\}', $cleanLoc } else { "$svcName in $cleanLoc, FL" }
            $content = [regex]::Replace($content, '(?s)<h1.*?>.*?</h1>', @"
            <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-gray-900">
                $($seoH1 -replace " in $cleanLoc, FL", " in <br><span class=`"text-gradient`">$cleanLoc, FL</span>")
            </h1>
"@)

            # SEO Hero Description
            $seoDesc = if ($serviceDescMap.ContainsKey($svcSlug)) { $serviceDescMap[$svcSlug] -replace '\{LOCATION\}', $cleanLoc } else { "Expert $svcName in $cleanLoc. 100% Satisfaction Guaranteed." }
            $content = [regex]::Replace($content, '(?s)<p class="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">.*?</p>', @"
            <p class="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                $seoDesc
            </p>
"@)
            
            # 2. Canonical and OG Tags
            $content = $content -replace '<link rel="canonical" href=".*?" />', "<link rel=""canonical"" href=""https://sweetmaidcleaning.com/$locSlug/$svcSlug/"" />"
            $content = $content -replace '<meta property="og:url" content=".*?">', "<meta property=""og:url"" content=""https://sweetmaidcleaning.com/$locSlug/$svcSlug/"">"
            $content = $content -replace '<meta property="og:title" content=".*?">', "<meta property=""og:title"" content=""$svcName in $cleanLoc, FL | Sweet Maid Cleaning"">"

            # 3. Content Localization
            $content = $content -replace "Bradenton’s", "$cleanLoc's"
            $content = $content -replace "Bradenton's", "$cleanLoc's" 
            $content = $content -replace "across Bradenton and Southwest Florida", "across $cleanLoc and Southwest Florida"
            $content = $content -replace "Bradenton home", "$cleanLoc home"
            $content = $content -replace "Why Bradenton Trusts Us", "Why $cleanLoc Trusts Us for $svcName"
            $content = $content -replace "Trusted by homeowners in Bradenton", "Trusted by homeowners in $cleanLoc"

            # 4. Schema Localization
            $content = $content -replace '"addressLocality":\s*".*?"', "`"addressLocality`": `"$cleanLoc`""
            $content = $content -replace '"name":\s*"Sweet Maid Cleaning Service - .*?"', "`"name`": `"Sweet Maid Cleaning Service - $svcName $cleanLoc`""
            $content = $content -replace '"url":\s*".*?"', "`"url`": `"https://sweetmaidcleaning.com/$locSlug/$svcSlug/`""
            $content = $content -replace '"name":\s*".*?, FL"', "`"name`": `"$cleanLoc, FL`""
            
            # 5. Path fix for images (Two levels deep)
            $content = $content.Replace('src="../images/', 'src="../../images/')
            $content = $content.Replace('url("../images/', 'url("../../images/')
            
            # Map Optimization
            $mapPb = "!1m18!1m12!1m3!1d113425.29828882585!2d-82.64501464999999!3d27.497495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2e663693aa661%3A0x628f8694032a1740!2s$($cleanLoc -replace ' ', '+')%2C+FL%2C+USA!5e0!3m2!1sen!2sus!4v1707520000000!5m2!1sen!2sus"
            if ($cleanLoc -eq "Miami") {
                $mapPb = "!1m18!1m12!1m3!1d3592.518!2d-80.19179!3d25.76168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b0a5015b3c53%3A0xc074744040974837!2sMiami%2C+FL%2C+USA!5e0!3m2!1sen!2sus!4v1739561081827!5m2!1sen!2sus"
            }
            $content = $content -replace 'MAP_PLACEHOLDER', $mapPb

            # Save
            [System.IO.File]::WriteAllText((Resolve-Path .).Path + "\$destFile", $content, $utf8NoBom)
        }
    }
}

Write-Host "Hyper-Local SEO Siloing Complete: $(($locations.Count * $services.Count)) pages generated."
