$locations = @(
    "Bradenton", "Anna Maria", "Foxleigh", "Palmer Ranch", "Lakewood Ranch", "Osprey", "University Park", "Laurel", 
    "Sarasota", "Longboat Key", "Bradenton Beach", "Nokomis", "Siesta Key", "Fruitville", "Holmes Beach", 
    "Whitfield", "Parrish", "Braden River", "Bee Ridge", "Bayshore Gardens", "Venice", "The Meadows", 
    "Gulf Gate Estates", "South Gate", "Ellenton", "Sarasota Springs", "Lake Sarasota", "South Sarasota", 
    "Palmetto", "Palma Sola", "Myakka", "Bird Key"
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
    @{ slug = "window-cleaning"; name = "Window Cleaning" }
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

# EXTREME SEO H1 MAPPING - Unique, High-Impact Titles
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

# KEYWORD-RICH HERO DESCRIPTIONS - Precise and Natural
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
    $locSlug = $loc.ToLower().Replace(" ", "-") + "-cleaning"
    
    foreach ($svc in $services) {
        $svcSlug = $svc.slug
        $svcName = $svc.name
        $sourceFile = "$svcSlug/index.html"
        $destDir = "$locSlug/$svcSlug"
        $destFile = "$destDir/index.html"
        
        Write-Host "Generating: $destFile"
        
        if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
        
        if (Test-Path $sourceFile) {
            $content = Get-Content $sourceFile -Raw -Encoding UTF8
            
            # Extract footer to protect it from location name replacements
            $footerPattern = '(?s)(<footer class=".*?">.*?</footer>)'
            $footerMatch = [regex]::Match($content, $footerPattern)
            $originalFooter = ""
            if ($footerMatch.Success) {
                $originalFooter = $footerMatch.Value
                # Use a unique placeholder that won't be affected by replacements
                $content = $content.Replace($originalFooter, "{{FOOTER_PLACEHOLDER_UNIQUE}}")
            }
            
            # 1. Localize Titles and Metas
            $content = $content -replace '(?s)<title>.*?</title>', "<title>Best $svcName in $cleanLoc, FL | Top Rated & Reliable Service</title>"
            $content = $content -replace '(?s)<meta name="description".*?>', "<meta name=""description"" content=""Need the best $svcName in $cleanLoc, FL? Sweet Maid offers expert, affordable, and top-rated cleaning services. Licensed & Insured. 100% Guaranteed. Get a Quote!"" />"
            
            # Extreme SEO H1 Overhaul
            $content = $content -replace '(?s)<h1.*?>.*?</h1>', @"
            <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-gray-900">
                Best $svcName in <br>
                <span class="text-gradient">$cleanLoc, FL</span>
            </h1>
"@

            # Extreme SEO Hero Description Overhaul
            $content = $content -replace '(?s)<p class="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">.*?</p>', @"
            <p class="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                Expert $svcName in $cleanLoc. Licensed & Insured. 100% Satisfaction Guaranteed.
            </p>
"@
            
            # 2. Canonical and OG Tags
            $content = $content -replace '<link rel="canonical" href=".*?" />', "<link rel=""canonical"" href=""https://sweetmaidcleaning.com/$locSlug/$svcSlug/"" />"
            $content = $content -replace '<meta property="og:url" content=".*?">', "<meta property=""og:url"" content=""https://sweetmaidcleaning.com/$locSlug/$svcSlug/"">"
            $content = $content -replace '<meta property="og:title" content=".*?">', "<meta property=""og:title"" content=""$svcName in $cleanLoc, FL | Sweet Maid Cleaning"">"

            # 3. Content Localization (Holistic Silo Replacement)
            # Replace all main service areas with the current localized one
            $content = $content -replace "Bradenton & Sarasota", "$cleanLoc"
            $content = $content -replace "Bradenton and Sarasota", "$cleanLoc"
            $content = $content -replace "Bradenton’s", "$cleanLoc's"
            $content = $content -replace "Bradenton's", "$cleanLoc's"
            $content = $content -replace "Bradenton", "$cleanLoc"
            $content = $content -replace "Sarasota", "$cleanLoc"
            $content = $content -replace "Lakewood Ranch", "$cleanLoc"
            $content = $content -replace "Parrish", "$cleanLoc"
            $content = $content -replace "Venice", "$cleanLoc"
            
            # Cleanup duplicate localizations
            $content = $content -replace "$cleanLoc & $cleanLoc", "$cleanLoc"
            $content = $content -replace "$cleanLoc and $cleanLoc", "$cleanLoc"
            
            # 4. Schema Localization Fixes (Regex & Literal)
            $content = $content -replace '"addressLocality":\s*".*?"', "`"addressLocality`": `"$cleanLoc`""
            $content = $content -replace '"name":\s*"Sweet Maid Cleaning Service - .*?"', "`"name`": `"Sweet Maid Cleaning Service - $svcName $cleanLoc`""
            $content = $content -replace '"url":\s*".*?"', "`"url`": `"https://sweetmaidcleaning.com/$locSlug/$svcSlug/`""
            # Fix the areaServed name (which might have been 'House, FL' or 'Bradenton, FL' in source)
            # This regex matches any "name": "...", followed by ", FL"
            $content = $content -replace '"name":\s*".*?, FL"', "`"name`": `"$cleanLoc, FL`""
            
            # Fix image paths for two-level deep directories (../images/ -> ../../images/)
            # We do this AFTER other replacements to avoid double-correcting if any were already fixed
            $content = $content.Replace('src="../images/', 'src="../../images/')
            $content = $content.Replace('url("../images/', 'url("../../images/')
            $content = $content.Replace("url('../images/", "url('../../images/")
            $content = $content.Replace("url(../images/", "url(../../images/")
            
            # Literal replacements for FAQ (Regex-safe)
            $content = $content.Replace('best cleaning service in "', "best cleaning service in $cleanLoc?`"")
            $content = $content.Replace('house cleaning cost in "', "house cleaning cost in $cleanLoc?`"")
            
            # 5. Metadata URL Standards (Ensures lowercase and avoids accidental replacement from content logic)
            # We use (?i) for case-insensitive match but provide a known lowercase replacement
            $content = $content -replace '(?i)<link rel="canonical" href=".*?" />', "<link rel=""canonical"" href=""https://sweetmaidcleaning.com/$locSlug/$svcSlug/"" />"
            $content = $content -replace '(?i)<meta property="og:url" content=".*?">', "<meta property=""og:url"" content=""https://sweetmaidcleaning.com/$locSlug/$svcSlug/"">"
            
            # Generic catch-all for any leftover 'House' or 'Bradenton' place-holders in text
            $content = $content -replace 'cost in House', "cost in $cleanLoc"
            $content = $content -replace 'service in House', "service in $cleanLoc"
            $content = $content -replace 'rated cleaning service in House', "rated cleaning service in $cleanLoc" 
            
            # Legacy/Pollution Fixes (Targeting Bradenton specifically)
            $content = $content -replace "Why Bradenton Trusts Us", "Why $cleanLoc Trusts Us for $svcName"
            $content = $content -replace "Bradenton's most trusted", "$cleanLoc's most trusted $svcName service"
            $content = $content -replace "Joy of Clean in Bradenton", "Joy of Clean in $cleanLoc"
            $content = $content -replace "Let Our Bradenton Team Contact You", "Let Our $cleanLoc Team Contact You"
            $content = $content -replace "Licensed & Insured Bradenton Cleaners", "Licensed & Insured $svcName Experts in $cleanLoc"
            $content = $content -replace "Trusted by homeowners in Bradenton", "Trusted by homeowners in $cleanLoc"
            
            # ---------------------------------------------------------
            # DEEP CONTENT INJECTION (Body Text Overhaul)
            # ---------------------------------------------------------
            
            # 1. Section Headers & Subheaders
            $content = $content -replace "The Sweet Maid Standard", "The Sweet Maid $svcName Standard"
            $content = $content -replace "Why Locals Trust Us", "Why $cleanLoc Trusts Us for $svcName"
            $content = $content -replace "Expert Cleaning for Every Need", "Expert $svcName for Every Need in $cleanLoc"
            
            # 2. Feature Titles & Descriptions
            $content = $content -replace "Trusted Professionals", "Trusted $svcName Experts"
            $content = $content -replace "Every team member undergoes", "Every $cleanLoc team member undergoes"
            $content = $content -replace "Impeccable Detail", "Impeccable $svcName Detail"
            $content = $content -replace "ensureing a level of clean", "ensuring a level of $svcName"
            $content = $content -replace "re-clean your Bradenton home", "re-clean your $cleanLoc home"
            $content = $content -replace "re-clean your home", "re-clean your $cleanLoc home"
            
            # 3. General Body Text Expansion
            # "cleaning service" -> "$svcName service" (Contextual)
            $content = $content -replace "premier cleaning solutions", "premier $svcName solutions"
            $content = $content -replace "keep your home spotless", "keep your $cleanLoc home spotless"
            $content = $content -replace "time to move on", "time to move out of your $cleanLoc home"
            $content = $content -replace "Make your new home fresh", "Make your new $cleanLoc home fresh"
            
            # 4. CTA & Footer
            $content = $content -replace "Get Your Free Quote", "Get Your Free $svcName Quote"
            $content = $content -replace "Call Me", "Call for $svcName"
            $content = $content -replace "Follow us for cleaning tips", "Follow us for $cleanLoc cleaning tips"
            
            # 5. FAQ Specifics (Aggressive)
            $content = $content -replace "cleaning services in", "$svcName services in"
            $content = $content -replace "Licensed & Insured Cleaners", "Licensed & Insured $svcName Experts in $cleanLoc"
            $content = $content -replace "quote for my home", "quote for my $cleanLoc home"
            
            # ---------------------------------------------------------
            # EXTREME SEO: SERVICE CARD DESCRIPTIONS
            # ---------------------------------------------------------
            
            # Carpet Cleaning
            $content = $content -replace "Professional steam cleaning to remove stains, odors, and allergens from carpets and rugs\.", "Professional $svcName in $cleanLoc to remove stains, odors, and allergens. Trusted by $cleanLoc homeowners."
            
            # Window Cleaning
            $content = $content -replace "Crystal-clear, streak-free windows inside and out for maximum natural light and curb appeal\.", "Crystal-clear $svcName in $cleanLoc for maximum natural light. Trusted window cleaning serving $cleanLoc."
            
            # Pressure Washing
            $content = $content -replace "Restore driveways, patios, and exterior surfaces with powerful, professional pressure washing\.", "Restore $cleanLoc driveways and patios with professional $svcName. Expert power washing in $cleanLoc."
            
            # Commercial Cleaning
            $content = $content -replace "Impress clients and protect employees with professional office janitorial services\.", "Impress clients with professional $svcName in $cleanLoc. Expert commercial cleaning for $cleanLoc businesses."
            
            # Airbnb Cleaning
            $content = $content -replace "Fast, reliable turnovers between guests with linen service and restocking for 5-star reviews\.", "Fast $svcName in $cleanLoc for Airbnb hosts. Professional vacation rental cleaning in $cleanLoc."
            
            # Post-Construction Cleaning
            $content = $content -replace "Removing fine dust and debris after renovations so your new space truly sparkles\.", "Expert $svcName in $cleanLoc removes construction dust and debris. Post-renovation cleaning for $cleanLoc properties."
            
            # House/Home Cleaning
            $content = $content -replace "Flexible residential cleaning for apartments, condos, and houses - one-time or recurring\.", "Flexible $svcName in $cleanLoc for apartments, condos, and houses. Recurring cleaning for $cleanLoc homeowners."
            
            # Deep Cleaning
            $content = $content -replace "A top-to-bottom, detailed clean to reset your space and eliminate hidden grime\.", "Top-to-bottom $svcName in $cleanLoc to eliminate hidden grime. Deep cleaning for $cleanLoc homes."
            
            # Move-In Cleaning
            $content = $content -replace "Make your new house fresh, sanitized, and move-in ready from day one\.", "Professional $svcName in $cleanLoc to make your home move-in ready. Trusted move-in cleaning in $cleanLoc."
            $content = $content -replace "Make your new home fresh, sanitized, and move-in ready from day one\.", "Professional $svcName in $cleanLoc to make your home move-in ready. Trusted move-in cleaning in $cleanLoc."
            
            # Move-Out Cleaning  
            $content = $content -replace "Leave your space spotless and stress-free when it's time to move out\.", "Expert $svcName in $cleanLoc leaves your space spotless. Professional move-out cleaning for $cleanLoc renters."
            $content = $content -replace "Leave your space spotless and stress-free when it's time to move out of your home\.", "Expert $svcName in $cleanLoc leaves your space spotless. Professional move-out cleaning for $cleanLoc renters."
            
            # ---------------------------------------------------------
            # EXTREME SEO: DETAILED SERVICE SECTIONS
            # ---------------------------------------------------------
            
            $content = $content -replace "Experience the luxury of a consistently pristine home\.", "Experience luxury $svcName in $cleanLoc for a consistently pristine home."
            $content = $content -replace "Our residential services are designed for busy professionals and families who value their time and peace of mind\.", "Our $svcName in $cleanLoc is designed for busy $cleanLoc professionals and families."
            
            # Generic "home" and "space" references
            $content = $content -replace "for your home\.", "for your $cleanLoc home."
            $content = $content -replace "in your home\.", "in your $cleanLoc home."
            $content = $content -replace "your entire home\.", "your entire $cleanLoc home."
            $content = $content -replace "spotless home\.", "spotless $cleanLoc home."
            $content = $content -replace "pristine home\.", "pristine $cleanLoc home."
            
            # Generic "team" references
            $content = $content -replace "our professional team", "our professional $cleanLoc $svcName team"
            $content = $content -replace "Our team arrives", "Our $cleanLoc $svcName team arrives"
            $content = $content -replace "the team will", "the $cleanLoc team will"
            
            # ---------------------------------------------------------
            # EXTREME SEO: CTA ENHANCEMENTS
            # ---------------------------------------------------------
            
            $content = $content -replace "Book Now\<", "Book $svcName in $cleanLoc Now\<"
            $content = $content -replace "\>Learn More\<", "\>Learn More About $svcName in $cleanLoc\<"
            $content = $content -replace "Contact Us Today", "Contact Us for $svcName in $cleanLoc"
            $content = $content -replace "Schedule Your Cleaning", "Schedule Your $cleanLoc $svcName"
            
            # ---------------------------------------------------------
            # EXTREME SEO: PROCESS STEPS & FEATURES
            # ---------------------------------------------------------
            
            $content = $content -replace "We arrive on time", "Our $cleanLoc $svcName team arrives on time"
            $content = $content -replace "assess your space", "assess your $cleanLoc property"
            $content = $content -replace "Professional equipment and supplies", "Professional $svcName equipment in $cleanLoc"
            $content = $content -replace "Background-checked cleaners", "Background-checked $svcName experts serving $cleanLoc"
            
            # ---------------------------------------------------------
            # EXTREME SEO: PARAGRAPH CONTENT
            # ---------------------------------------------------------
            
            $content = $content -replace "Southwest Florida's premier cleaning solutions", "Southwest Florida's premier $svcName solutions"
            $content = $content -replace "designed to keep your home spotless and stress-free", "designed to keep your $cleanLoc home spotless and stress-free"
            $content = $content -replace "Trusted by homeowners", "Trusted by $cleanLoc homeowners"
            $content = $content -replace "and beyond\.", "and throughout Southwest Florida."
            
            # Feature descriptions
            $content = $content -replace "hotel-standard training before entering your home", "hotel-standard $svcName training before entering your $cleanLoc home"
            $content = $content -replace "from baseboards to ceiling fans", "from baseboards to ceiling fans in your $cleanLoc home"
            
            # ---------------------------------------------------------
            # UNIQUE HERO IMAGE INJECTION
            # ---------------------------------------------------------
            if ($serviceImageMap.ContainsKey($svcSlug)) {
                $heroImage = $serviceImageMap[$svcSlug]
                $content = $content -replace 'id="heroImage" src=".*?"', "id=`"heroImage`" src=`"$heroImage`""
            }
            
            # ---------------------------------------------------------
            # EXTREME SEO H1 INJECTION
            # ---------------------------------------------------------
            if ($serviceH1Map.ContainsKey($svcSlug)) {
                $seoH1 = $serviceH1Map[$svcSlug] -replace '\{LOCATION\}', $cleanLoc
                # Find and replace the H1 content, preserving HTML structure
                $content = $content -replace '(?s)(\<h1[^\>]*\>).*?(\</h1\>)', "`$1$seoH1`$2"
            }
            
            # ---------------------------------------------------------
            # KEYWORD-RICH DESCRIPTION INJECTION
            # ---------------------------------------------------------
            if ($serviceDescMap.ContainsKey($svcSlug)) {
                $seoDesc = $serviceDescMap[$svcSlug] -replace '\{LOCATION\}', $cleanLoc
                # Replace the hero paragraph description
                $content = $content -replace '(?s)Expert .*? in .*?\. Licensed & Insured\. 100% Satisfaction Guaranteed\.', $seoDesc
            }
            
            # Restore the original footer
            if ($footerMatch.Success) {
                $content = $content.Replace("{{FOOTER_PLACEHOLDER_UNIQUE}}", $originalFooter)
            }
            
            # Restore the original footer
            if ($footerMatch.Success) {
                $content = $content -replace "{{FOOTER_PLACEHOLDER}}", [regex]::Escape($originalFooter)
            }

            [System.IO.File]::WriteAllText((Resolve-Path .).Path + "\$destFile", $content, $utf8NoBom)
        }
    }
}

Write-Host "Hyper-Local SEO Rollout Complete: $(($locations.Count * $services.Count)) pages generated."
