$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
Set-Location $root

# 1. Move index.html to home/index.html
if (Test-Path "index.html") {
    $homeDir = Join-Path $root "home"
    if (-not (Test-Path $homeDir)) { New-Item -ItemType Directory -Path $homeDir | Out-Null }
    Move-Item -Path "index.html" -Destination (Join-Path $homeDir "index.html") -Force
    Write-Host "Moved index.html to home/index.html"
}

# 2. Get all other HTML files in the root (excluding index.html which is gone, and not recurse yet)
$files = Get-ChildItem -Path $root -Filter *.html -File

foreach ($file in $files) {
    if ($file.Name -eq "index.html") { continue } # Should be gone, but safety check for new root index

    $baseName = $file.BaseName
    $newDir = Join-Path $root $baseName
    
    if (-not (Test-Path $newDir)) { New-Item -ItemType Directory -Path $newDir | Out-Null }
    
    $destination = Join-Path $newDir "index.html"
    Move-Item -Path $file.FullName -Destination $destination -Force
    Write-Host "Moved $($file.Name) to $baseName/index.html"
}

# 3. Create new root index.html for redirect
$rootIndexContent = @"
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="refresh" content="0; url=/home/" />
<script>window.location.href = "/home/";</script>
<title>Redirecting...</title>
</head>
<body>
<p>If you are not redirected, <a href="/home/">click here</a>.</p>
</body>
</html>
"@
Set-Content -Path (Join-Path $root "index.html") -Value $rootIndexContent
Write-Host "Created root redirect index.html"

# 4. Update References in ALL index.html files (recursively now)
$allIndexFiles = Get-ChildItem -Path $root -Filter "index.html" -Recurse

foreach ($file in $allIndexFiles) {
    # Skip the root redirect file we just created
    if ($file.DirectoryName -eq $root) { continue }

    $content = Get-Content $file.FullName -Raw

    # Update Links: href="page.html" -> href="/page/"
    # Special case: href="index.html" -> href="/home/"
    $content = $content -replace 'href="index\.html"', 'href="/home/"'
    $content = $content -replace 'href="([^"]+)\.html"', 'href="/$1/"'
    
    # Update Asset Paths to Root Absolute
    # Images
    $content = $content -replace 'src="images/', 'src="/images/'
    $content = $content -replace 'content="images/', 'content="/images/'
    
    # CSS/JS/Fonts usually absolute or CDN, but check valid local relative ones
    # (Tailwind, FontAwesome are CDN in this project based on view_file)
    # Check if there are local assets
    
    # Fix Canonical URLs
    # href="https://sweetmaidcleaning.com/about.html" -> href="https://sweetmaidcleaning.com/about/"
    $content = $content -replace 'link rel="canonical" href="(https?://[^"]+)\.html"', 'link rel="canonical" href="$1/"'
    
    # Special Fix for Open Graph URL
    $content = $content -replace 'meta property="og:url" content="(https?://[^"]+)\.html"', 'meta property="og:url" content="$1/"'

    # Fix Navigation Active States or other specific relative links if any
    # (None obvious from previous view, standard nav looks updated by regex above)

    Set-Content -Path $file.FullName -Value $content -Ref NoNewline
    Write-Host "Updated links in $($file.FullName)"
}

Write-Host "Refactoring Complete"
