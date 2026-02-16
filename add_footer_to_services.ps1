# Extract footer from home/index.html
$homeContent = Get-Content "home\index.html" -Raw -Encoding UTF8

# Use regex to extract footer
if ($homeContent -match "(?s)(<!-- ================================================.*?FOOTER.*?</footer>)") {
    $footer = $matches[1]
    Write-Host "Footer extracted successfully"
} else {
    Write-Host "ERROR: Could not find footer in home/index.html"
    exit 1
}

# List of service files to update
$services = @(
    "house-cleaning\index.html",
    "deep-cleaning\index.html",
    "move-in-out-cleaning\index.html",
    "airbnb-cleaning\index.html",
    "commercial-cleaning\index.html",
    "post-construction-cleaning\index.html",
    "carpet-cleaning\index.html",
    "pressure-washing\index.html",
    "window-cleaning\index.html"
)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($service in $services) {
    if (Test-Path $service) {
        Write-Host "Adding footer to $service"
        $content = Get-Content $service -Raw -Encoding UTF8
        
        # Remove any existing footer first
        if ($content -match "(?s)<!-- ================================================.*?FOOTER.*?</footer>") {
            $content = $content -replace "(?s)<!-- ================================================.*?FOOTER.*?</footer>", ""
        }
        
        # Insert footer before </body>
        $content = $content -replace "(</script>[\r\n\s]*)(</body>)", "`$1`r`n`r`n$footer`r`n`r`n`$2"
        
        # Write back
        [System.IO.File]::WriteAllText((Resolve-Path .).Path + "\$service", $content, $utf8NoBom)
    }
}

Write-Host "Footer added to all service files!"
