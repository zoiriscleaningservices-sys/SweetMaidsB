# update_favicon.ps1
$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"

# Use the image provided by user
$faviconUrl = "/images/favicon.jpeg?v=2"
# Construct the link tag string.
$faviconTag = "<link rel=`"icon`" type=`"image/jpeg`" href=`"$faviconUrl`">"
$appleTouchIconTag = "<link rel=`"apple-touch-icon`" href=`"$faviconUrl`">"

Get-ChildItem -Path $root -Include *.html -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $originalContent = $content
    
    # 1. Remove existing favicon/icon tags to avoid duplicates
    $content = $content -replace '<link[^>]*rel=["''](?:shortcut )?icon["''][^>]*>', ''
    $content = $content -replace '<link[^>]*rel=["'']apple-touch-icon["''][^>]*>', ''
    
    # 2. Add new tags before </head>
    if ($content -match '</head>') {
        $newTags = "  $faviconTag`n  $appleTouchIconTag`n</head>"
        $content = $content -replace '</head>', $newTags
        Write-Host "Updated favicon in: $($_.Name)"
    } else {
        Write-Warning "No </head> tag found in $($_.Name)"
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $_.FullName -Value $content -Encoding UTF8
    }
}

Write-Host "Favicon update complete."
