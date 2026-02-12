$sourceFile = "index.html"
$content = Get-Content $sourceFile -Raw

# Extract the updated grid using regex
$gridPattern = '(?s)<div class="grid grid-cols-2 md:grid-cols-4 gap-3\">.*?</div>'
$gridMatch = [regex]::Match($content, $gridPattern)

if (-not $gridMatch.Success) {
    Write-Error "Could not find the updated grid in index.html"
    exit
}

$newGrid = $gridMatch.Value

$services = "house-cleaning.html", "airbnb-cleaning.html", "deep-cleaning.html", "post-construction-cleaning.html", "commercial-cleaning.html", "move-in-out-cleaning.html", "pressure-washing.html", "carpet-cleaning.html", "window-cleaning.html"

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($file in $services) {
    if (Test-Path $file) {
        Write-Host "Updating grid in $file..."
        $fileContent = Get-Content $file -Raw
        
        # Replace the old grid (which likely has href="#")
        $oldGridPattern = '(?s)<div class="grid grid-cols-2 md:grid-cols-4 gap-3\">.*?</div>'
        $fileContent = [regex]::Replace($fileContent, $oldGridPattern, $newGrid)
        
        [System.IO.File]::WriteAllText((Resolve-Path .).Path + "\$file", $fileContent, $utf8NoBom)
    }
}

Write-Host "Service Pages Grid Update Complete!"
# Re-run master generator for locations
Write-Host "Regenerating Location Pages..."
powershell -ExecutionPolicy Bypass -File master_generator.ps1
