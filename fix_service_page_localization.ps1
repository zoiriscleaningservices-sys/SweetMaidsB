$servicePages = @(
    "house-cleaning.html",
    "deep-cleaning.html",
    "move-in-out-cleaning.html",
    "airbnb-cleaning.html",
    "post-construction-cleaning.html",
    "commercial-cleaning.html",
    "window-cleaning.html",
    "carpet-cleaning.html",
    "pressure-washing.html"
)

foreach ($page in $servicePages) {
    if (Test-Path $page) {
        Write-Host "Localizing $page..."
        $content = [System.IO.File]::ReadAllText($page)
        $original = $content

        # 1. Update "Let Our Bradenton Team Contact You" -> "Let Our Team Contact You"
        # (To be more generic on service pages, or "Bradenton & Sarasota Team")
        $content = $content -replace "Let Our Bradenton Team Contact You", "Let Our Cleaning Team Contact You"
        
        # 2. Update "Licensed & Insured Bradenton Cleaners" -> "Licensed & Insured Cleaners"
        # (Or "Bradenton & Sarasota Cleaners")
        $content = $content -replace "Licensed & Insured Bradenton Cleaners", "Licensed & Insured Cleaners"
        
        # 3. Update "in Bradenton FL." (Headline) -> "in Bradenton & Sarasota."
        # Use regex to avoid replacing "in Bradenton FL" inside address or other specific contexts if any.
        # The headline usually is: <span class="text-gradient">in Bradenton FL.</span>
        $content = $content -replace 'in Bradenton FL.<', 'in Bradenton & Sarasota.<'
        
        # 4. Update "Bradenton's Favorite Cleaners" (Meta Title/OG)
        $content = $content -replace "Bradenton's Favorite Cleaners", "Bradenton & Sarasota's Favorite Cleaners"
        
        # 5. Update "for Bradenton families" / "for Bradenton hosts" / "for Bradenton businesses"
        # Let's try to be smart.
        # "for Bradenton families" -> "for local families"
        $content = $content -replace "for Bradenton families", "for Bradenton & Sarasota families"
        $content = $content -replace "for Bradenton hosts", "for local hosts"
        $content = $content -replace "for Bradenton businesses", "for local businesses"
        
        # 6. Update Title Tag "Bradenton FL" -> "Bradenton & Sarasota"
        # <title>... Bradenton FL ...</title>
        # Be careful not to break it.
        # Example: <title>House Cleaning Services Bradenton FL | ...</title>
        $content = [regex]::Replace($content, '<title>(.*?)Bradenton FL(.*?)</title>', '<title>$1Bradenton & Sarasota$2</title>')

        # 7. Update Intro Text "Founded right here in Bradenton" -> "Founded right here in Bradenton" (Keep history?)
        # "Highest standard ... for Bradenton families" -> "for local families"

        if ($content -ne $original) {
            [System.IO.File]::WriteAllText($page, $content, [System.Text.Encoding]::UTF8)
            Write-Host "  Updated $page"
        } else {
            Write-Host "  No changes needed for $page"
        }
    }
}
