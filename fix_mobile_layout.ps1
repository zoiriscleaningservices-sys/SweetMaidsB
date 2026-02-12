$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
$files = Get-ChildItem -Path $root -Filter "*.html" -Recurse

$oldBannerPattern = '(?s)<!-- Top Bar -->\s*<div\s+class="bg-gradient-to-r from-pink-300 via-pink-300 to-pink-300 text-gray-800 text-xs py-2.5 text-center font-semibold tracking-wide">.*?Call Now: \(645\) 217-6738\s*</span>\s*</div>'

$newBannerHtml = @"
    <!-- Top Bar -->
    <div
      class="bg-gradient-to-r from-pink-300 via-pink-300 to-pink-300 text-gray-800 text-xs py-2.5 text-center font-semibold tracking-wide px-4">
      <div class="flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
        <span><i class="fa-solid fa-star text-yellow-300 mr-1 animate-pulse"></i> #1 Rated Cleaning Service in Bradenton</span>
        <span class="hidden sm:inline">|</span>
        <span><i class="fa-solid fa-phone mr-1"></i> Call Now: (645) 217-6738</span>
      </div>
    </div>
"@

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $changed = $false

    # Fix Banner
    if ($content -match $oldBannerPattern) {
        $content = [regex]::Replace($content, $oldBannerPattern, $newBannerHtml)
        $changed = $true
    }

    # Fix H1 font size for mobile
    if ($content -match '<h1 class="text-5xl') {
        $content = $content -replace '<h1 class="text-5xl', '<h1 class="text-4xl'
        $changed = $true
    }

    # Fix whitespace-nowrap in hero form buttons
    if ($content -match 'whitespace-nowrap') {
        $content = $content -replace 'whitespace-nowrap', 'sm:whitespace-nowrap'
        $changed = $true
    }

    if ($changed) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "Fixed mobile layout in $($file.FullName)"
    }
}

Write-Host "Mobile layout fixes complete."
