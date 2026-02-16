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
                $content = $content -replace [regex]::Escape($originalFooter), "{{FOOTER_PLACEHOLDER}}"
            }
            
            # 1. Localize Titles and Metas
            $content = $content -replace '(?s)<title>.*?</title>', "<title>$svcName in $cleanLoc, FL | #1 Rated Cleaning Service</title>"
            $content = $content -replace '(?s)<meta name="description".*?>', "<meta name=""description"" content=""Looking for $svcName in $cleanLoc, FL? Sweet Maid offers top-rated localized cleaning services. Licensed, insured, and 100% satisfaction guaranteed. Book today!"" />"
            
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
            
            # Restore the original footer
            if ($footerMatch.Success) {
                $content = $content -replace "{{FOOTER_PLACEHOLDER}}", [regex]::Escape($originalFooter)
            }

            [System.IO.File]::WriteAllText((Resolve-Path .).Path + "\$destFile", $content, $utf8NoBom)
        }
    }
}

Write-Host "Hyper-Local SEO Rollout Complete: $(($locations.Count * $services.Count)) pages generated."
