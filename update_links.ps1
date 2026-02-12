$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
Set-Location $root

# 4. Update References in ALL index.html files (recursively now)
$allIndexFiles = Get-ChildItem -Path $root -Filter "index.html" -Recurse

foreach ($file in $allIndexFiles) {
    # Skip the root redirect file if it matches (it's at $root\index.html)
    if ($file.FullName -eq (Join-Path $root "index.html")) { continue }

    $content = Get-Content $file.FullName -Raw

    # Update Links: href="page.html" -> href="/page/"
    # Special case: href="index.html" -> href="/home/"
    $content = $content -replace 'href="index\.html"', 'href="/home/"'
    $content = $content -replace 'href="([^"]+)\.html"', 'href="/$1/"'
    
    # Update Asset Paths to Root Absolute
    # Images
    $content = $content -replace 'src="images/', 'src="/images/'
    $content = $content -replace 'content="images/', 'content="/images/'
    
    # Fix Canonical URLs
    # href="https://sweetmaidcleaning.com/about.html" -> href="https://sweetmaidcleaning.com/about/"
    $content = $content -replace 'link rel="canonical" href="(https?://[^"]+)\.html"', 'link rel="canonical" href="$1/"'
    
    # Special Fix for Open Graph URL
    $content = $content -replace 'meta property="og:url" content="(https?://[^"]+)\.html"', 'meta property="og:url" content="$1/"'

    # Using -NoNewline if valid, otherwise just Set-Content (default adds newline at EOF which is usually fine)
    Set-Content -Path $file.FullName -Value $content
    Write-Host "Updated links in $($file.FullName)"
}

Write-Host "Link Update Complete"
