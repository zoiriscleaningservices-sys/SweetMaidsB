
$files = Get-ChildItem -Filter *.html -Recurse

foreach ($file in $files) {
    [string]$content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $modified = $false
    
    # Broken: content="Sweet Maid Cleaning Service  "  Bradenton
    # Regex: content="Sweet Maid Cleaning Service\s*"\s*Bradenton
    # Target: content="Sweet Maid Cleaning Service | Bradenton
    
    if ($content -match 'content="Sweet Maid Cleaning Service\s*"\s*Bradenton') {
        $content = $content -replace 'content="Sweet Maid Cleaning Service\s*"\s*Bradenton', 'content="Sweet Maid Cleaning Service | Bradenton'
        $modified = $true
        Write-Host "Fixed OG Title (Broken Attr) in $($file.Name)"
    }
    
    # Also verify if there are any double quotes " " inside content
    # content="Sweet Maid Cleaning Service " " Bradenton
    # Regex: content="Sweet Maid Cleaning Service\s*"\s*"\s*Bradenton
    if ($content -match 'content="Sweet Maid Cleaning Service\s*"\s*"\s*Bradenton') {
        $content = $content -replace 'content="Sweet Maid Cleaning Service\s*"\s*"\s*Bradenton', 'content="Sweet Maid Cleaning Service | Bradenton'
        $modified = $true
        Write-Host "Fixed OG Title (Double Quote) in $($file.Name)"
    }

    if ($modified) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    }
}
