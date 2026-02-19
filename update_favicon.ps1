# update_favicon.ps1
$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"

# User replaced jpeg with png
$faviconUrl = "/images/favicon.png?v=3"
# Construct the link tag string.
$faviconTag = "<link rel=`"icon`" type=`"image/png`" href=`"$faviconUrl`">"
$appleTouchIconTag = "<link rel=`"apple-touch-icon`" href=`"$faviconUrl`">"

Get-ChildItem -Path $root -Include *.html -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $originalContent = $content
    
    # 1. Remove existing favicon/icon tags (removing old jpeg tags too)
    $content = $content -replace '<link[^>]*rel=["''](?:shortcut )?icon["''][^>]*>', ''
    $content = $content -replace '<link[^>]*rel=["'']apple-touch-icon["''][^>]*>', ''
    # Clean up empty lines
    $content = $content -replace '(?m)^\s*<link[^>]*rel=["''](?:shortcut )?icon["''][^>]*>\r?\n', ''
    
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
