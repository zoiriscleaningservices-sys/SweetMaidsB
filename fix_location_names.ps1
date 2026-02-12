$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
$files = Get-ChildItem -Path $root -Filter "*.html" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # 1. Fix Fosleigh / Fosleight -> Foxleigh (Text)
    # 2. Fix directory links: fosleight-cleaning -> foxleigh-cleaning
    
    # Simple strings first
    $content = $content -replace "Fosleigh", "Foxleigh"
    $content = $content -replace "Fosleight", "Foxleigh"
    
    # URL replacement (case insensitive by default in PowerShell replace, but being specific helps)
    $content = $content -replace "fosleight-cleaning", "foxleigh-cleaning"
    
    # 3. University Park -> University Park, FL
    # We want to avoid changing URLs like /university-park-cleaning/
    # And avoid changing if it already says "University Park, FL"
    
    # Strategy: Match "University Park" that is NOT part of a hyphenated string or URL path.
    # We can rely on the fact that visible text usually has spaces, URLs have hyphens.
    # But "University Park" has a space.
    # URLs: university-park-cleaning ( lowercase, usually). 
    # Let's target Title Case "University Park".
    # And lookahead to ensure not followed by ", FL" or " FL".
    
    # Regex:
    # University Park(?![-\w]|, FL| FL)
    # Negative lookahead:
    # - no hyphen or word char immediately after (prevents matches inside strictly hyphenated things if they used Title Case? Unlikely but possible)
    # - no ", FL"
    # - no " FL"
    
    $content = $content -replace "University Park(?![-\w]|, FL| FL)", "University Park, FL"
    
    if ($content -ne $originalContent) {
        Write-Host "Updated locations in $($file.Name)"
        Set-Content -Path $file.FullName -Value $content
    }
}

# Also update sitemap.xml
$sitemap = "$root\sitemap.xml"
if (Test-Path $sitemap) {
    $content = Get-Content $sitemap -Raw
    $originalContent = $content
    $content = $content -replace "fosleight-cleaning", "foxleigh-cleaning"
    if ($content -ne $originalContent) {
        Write-Host "Updated sitemap.xml"
        Set-Content -Path $sitemap -Value $content
    }
}

Write-Host "Location name fix complete."
