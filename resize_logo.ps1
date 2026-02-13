$files = Get-ChildItem -Recurse -Filter *.html

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content

    # 1. Update Logo Image Height (h-20 -> h-24 mobile, h-28 desktop)
    # Target: class="h-20 w-auto object-contain
    $content = $content -replace 'class="h-20 w-auto object-contain', 'class="h-24 md:h-28 w-auto object-contain'

    # 2. Update Header Container Height (h-20 -> h-24 mobile, h-28 desktop)
    # Target: class="flex items-center justify-between h-20"
    $content = $content -replace 'class="flex items-center justify-between h-20"', 'class="flex items-center justify-between h-24 md:h-28"'

    if ($content -ne $originalContent) {
        Write-Host "Updating $($file.FullName)..."
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    }
}

Write-Host "Logo resize complete!"
