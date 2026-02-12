$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
$files = Get-ChildItem -Path $root -Filter "*.html" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Fix the overlap issue: Foxleight -> Foxleigh
    $content = $content -replace "Foxleight", "Foxleigh"
    
    # Try to catch "University Park" that is at the end of a link text
    # e.g. "University Park</a>" or "University Park </a>"
    # But be careful not to duplicate ", FL" if I run this multiple times.
    
    # Regex: University Park(?=\s*<)
    # This looks for University Park followed by optional whitespace and then a <
    # And we verify it doesn't already have FL
    
    # We use a scriptblock for replacement to check context if needed, but simple regex might suffice if we are careful.
    # Replace "University Park" with "University Park, FL" IF followed by <
    $content = $content -replace "University Park(?=\s*<)", "University Park, FL"
    
    # Also handle the multi-line case seen in the navbar if possible
    # "University\s+Park" where \s+ includes newlines.
    # PowerShell regex is multiline by default for . matches? No.
    # \s matches newlines.
    # But replacing "University\s+Park" removes the newline, might break formatting?
    # Getting too complex might be risky.
    # Let's stick to the visible "University Park" -> "University Park, FL" in titles/headers/paragraphs.
    
    if ($content -ne $originalContent) {
        Write-Host "Fixed Foxleight/University Park in $($file.Name)"
        Set-Content -Path $file.FullName -Value $content
        
        # Verify Foxleigh
        if ($file.Name -eq "index.html" -and $file.Directory.Name -eq "foxleigh-cleaning") {
             Write-Host "Verification for foxleigh-cleaning/index.html:"
             $lines = $content -split "`n"
             $lines | Select-String "Foxleigh" -Context 0,1 | Out-String | Write-Host
        }
    }
}

Write-Host "Location fix v2 complete."
