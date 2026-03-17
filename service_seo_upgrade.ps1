$services = @{
    "house-cleaning.html" = "House Cleaning"
    "airbnb-cleaning.html" = "Airbnb Cleaning"
    "deep-cleaning.html" = "Deep Cleaning"
    "post-construction-cleaning.html" = "Post-Construction Cleaning"
    "commercial-cleaning.html" = "Commercial Cleaning"
    "move-in-out-cleaning.html" = "Move In/Out Cleaning"
    "pressure-washing.html" = "Pressure Washing"
    "carpet-cleaning.html" = "Carpet Cleaning"
    "window-cleaning.html" = "Window Cleaning"
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($file in $services.Keys) {
    if (Test-Path $file) {
        Write-Host "Upgrading $file..."
        $content = Get-Content $file -Raw
        $name = $services[$file]
        
        # 1. Update Hero Badge
        $content = $content -replace 'Licensed & Insured Cleaning Professionals', "Licensed & Insured Bradenton Cleaners"
        
        # 2. Update Hero H1 (Handle "Professional" or "Intensive")
        $h1Pattern = '(?s)<h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold leading-\[1\.1\] mb-6 text-gray-900\">.*?</h1>'
        $newH1 = @"
<h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-gray-900">
            Professional $name <br>
            <span class="text-gradient">in Bradenton FL.</span>
          </h1>
"@
        $content = [regex]::Replace($content, $h1Pattern, $newH1)
        
        # 3. Update Hero Form Heading
        $content = $content -replace 'Let Us Contact You</h3>', "Let Our Bradenton Team Contact You</h3>"
        
        # 4. Update Header Top Bar (if needed)
        # It should already be good, but let's ensure it says "in Bradenton"
        $content = $content -replace 'in Bradenton</span>', "in Bradenton</span>"

        [System.IO.File]::WriteAllText((Resolve-Path .).Path + "\$file", $content, $utf8NoBom)
    }
}

Write-Host "Service Pages SEO Upgrade Complete!"
