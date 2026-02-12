
$files = Get-ChildItem -Filter *.html -Recurse

foreach ($file in $files) {
    # Force UTF8
    [string]$content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $modified = $false
    
    # 1. Fix Airbnb Star
    # Pattern: 5[GARBAGE]</div>
    if ($content -match 'mb-1">5[^<]+</div>') {
        $content = $content -replace 'mb-1">5[^<]+</div>', 'mb-1">5 Stars</div>'
        $modified = $true
        Write-Host "Fixed Airbnb Star in $($file.Name)"
    }
    
    # 2. Fix Emoji
    # Pattern: [Spaces][GARBAGE] Servicing entire
    # Search for "Servicing entire"
    if ($content -match '(\s+)[^<a-zA-Z0-9]+ Servicing entire') {
        $content = $content -replace '(\s+)[^<a-zA-Z0-9]+ Servicing entire', '$1📍 Servicing entire'
        $modified = $true
        Write-Host "Fixed Emoji in $($file.Name)"
    }

    if ($modified) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    }
}
