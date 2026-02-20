$sourceFile = "home/index.html"
Write-Host "Current Directory: $((Get-Location).Path)"
$content = Get-Content $sourceFile -Raw

# 1. Extract Master Header
$headerMatch = [regex]::Match($content, '(?s)<header.*?</header>')
if ($headerMatch.Success) {
    $headerContent = $headerMatch.Value
} else {
    Write-Error "Could not find header in $sourceFile"
    exit
}

# 2. Extract Master Mobile Menu
# Extracts from the start of the comment to the start of the next section
$menuMatch = [regex]::Match($content, '(?s)<!-- Mobile Menu -->.*?<!-- ================================================\s+HERO')
if ($menuMatch.Success) {
    # We want everything except the HERO comment itself
    $menuContent = $menuMatch.Value -replace '(?s)<!-- ================================================\s+HERO.*', ''
    $menuContent = $menuContent.Trim()
} else {
    Write-Error "Could not find mobile menu in $sourceFile"
    exit
}

$files = Get-ChildItem -Path . -Filter *.html -Recurse
$files = $files | Where-Object { 
    $_.FullName -notmatch "node_modules" -and 
    $_.FullName -notmatch "home\\index.html" -and 
    $_.FullName -ne (Join-Path (Get-Location).Path "index.html")
}

Write-Host "Found $($files.Count) files to sync."

foreach ($file in $files) {
    Write-Host "Syncing $($file.Name)..."
    $fileContent = Get-Content $file.FullName -Raw
    
    # Replace Header
    if ($fileContent -match '(?s)<header.*?</header>') {
        $fileContent = [regex]::Replace($fileContent, '(?s)<header.*?</header>', $headerContent)
    }

    # Replace Mobile Menu
    if ($fileContent -match '(?s)<!-- Mobile Menu.*?-->.*?<!-- ================================================') {
        $fileContent = [regex]::Replace($fileContent, '(?s)<!-- Mobile Menu.*?-->.*?<!-- ================================================', "$menuContent`n<!-- ================================================")
    }
    
    # Save
    Set-Content $file.FullName $fileContent
}
Write-Host "Navigation synchronization complete!"
