$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
$files = Get-ChildItem -Path $root -Filter "*.html" -Recurse

$globalCssPattern = '(?s)\.animate-float \{.*?\}'
$newCss = ".animate-float {
      animation: float 6s ease-in-out infinite;
    }

    /* Global Horizontal Overflow Fix */
    html,
    body {
      overflow-x: hidden !important;
      position: relative;
      width: 100%;
    }"

$arrowsPattern = '(?s)<button onclick="document.getElementById\(''reviews-carousel''\).scrollBy\(\{left: -400, behavior: ''smooth''\}\)"\s*class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition">'
$newArrowLeft = '<button onclick="document.getElementById(''reviews-carousel'').scrollBy({left: -400, behavior: ''smooth''})"
          class="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition">'

$arrowsRightPattern = '(?s)<button onclick="document.getElementById\(''reviews-carousel''\).scrollBy\(\{left: 400, behavior: ''smooth''\}\)"\s*class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition">'
$newArrowRight = '<button onclick="document.getElementById(''reviews-carousel'').scrollBy({left: 400, behavior: ''smooth''})"
          class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition">'

foreach ($file in $files) {
    if ($file.Name -eq "index.html" -and $file.DirectoryName -match "SweetMaidsB$") { continue } # Skip root if needed, but let's be thorough
    
    $content = Get-Content $file.FullName -Raw
    $changed = $false

    # Global CSS
    if ($content -match '\.animate-float \{') {
        $content = [regex]::Replace($content, $globalCssPattern, $newCss)
        $changed = $true
    }

    # Section overflow-hidden
    if ($content -match '<section(?![^>]*overflow-hidden)') {
        $content = $content -replace '<section', '<section overflow-hidden'
        $changed = $true
    }

    # Carousel Arrows
    if ($content -match $arrowsPattern) {
        $content = [regex]::Replace($content, $arrowsPattern, $newArrowLeft)
        $changed = $true
    }
    if ($content -match $arrowsRightPattern) {
        $content = [regex]::Replace($content, $arrowsRightPattern, $newArrowRight)
        $changed = $true
    }

    if ($changed) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "Secured mobile layout in $($file.FullName)"
    }
}

Write-Host "Final mobile security pass complete."
