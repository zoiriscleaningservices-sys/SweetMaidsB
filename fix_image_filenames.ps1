$imagesDir = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB\images"
$rootDir = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"

# Get all image files in the images directory
$imageFiles = Get-ChildItem -Path $imagesDir -File

foreach ($image in $imageFiles) {
    # Generate new clean name: lowercase, replace spaces with hyphens, remove parens
    $newName = $image.Name.ToLower() -replace '\s+', '-' -replace '\(', '' -replace '\)', ''
    
    # Only process if rename is needed
    if ($newName -ne $image.Name) {
        $oldPath = $image.FullName
        $newPath = Join-Path $imagesDir $newName
        
        Write-Host "Renaming '$($image.Name)' to '$newName'"
        
        # Rename the file
        Rename-Item -Path $oldPath -NewName $newName
        
        # Update references in all HTML files
        $htmlFiles = Get-ChildItem -Path $rootDir -Filter "*.html" -Recurse
        
        foreach ($htmlFile in $htmlFiles) {
            $content = Get-Content $htmlFile.FullName -Raw
            
            # Escape special regex chars in old name for the match pattern
            $escapedOldName = [regex]::Escape($image.Name)
            
            # Replace /images/Old Name.jpeg with /images/new-name.jpeg
            # We look for explicit path matches to avoid accidental substring replacement
            # Common patterns: src="/images/...", url('/images/...'), href="/images/..."
            
            if ($content -match $escapedOldName) {
                Write-Host "  Updating references in $($htmlFile.Name)"
                $content = $content -replace $escapedOldName, $newName
                Set-Content -Path $htmlFile.FullName -Value $content
            }
        }
    }
}

Write-Host "Image filename fix complete."
