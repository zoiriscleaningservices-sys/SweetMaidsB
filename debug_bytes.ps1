
function Debug-Bytes($file, $context, $offset, $length, $name) {
    try {
        if (-not (Test-Path $file)) { 
            Write-Host "Skipping $file (not found)"
            return 
        }
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $str = [System.Text.Encoding]::UTF8.GetString($bytes)
        
        $index = $str.IndexOf($context)
        if ($index -ge 0) {
            $start = $index + $offset
            $end = $start + $length - 1
            $targetBytes = $bytes[$start..$end]
            
            Write-Host "--- $name ($file) ---"
            foreach ($b in $targetBytes) { Write-Host ("{0:X2} " -f $b) -NoNewline }
            Write-Host ""
            $safeBytes = $targetBytes | ForEach-Object { if ($_ -eq 0) { 63 } else { $_ } }
            Write-Host "String: $([System.Text.Encoding]::UTF8.GetString($safeBytes))"
            Write-Host "---------------------------"
        } else {
            Write-Host "Context '$context' not found in $file"
        }
    } catch { Write-Host "Error processing $name : $_" }
}

# 1. OG Title Corruption: "Sweet Maid Cleaning Service [CORRUPTION] Bradenton"
# house-cleaning.html
Debug-Bytes "house-cleaning.html" "Sweet Maid Cleaning Service " 28 30 "OG Title"

# 2. Body Text Apostrophe: "We don[CORRUPTION]t just clean"
# house-cleaning.html
Debug-Bytes "house-cleaning.html" "We don" 6 15 "Apostrophe"

# 3. Service Area Emoji: "[CORRUPTION]  Servicing entire"
# house-cleaning.html (Search for Servicing entire, look backwards?)
# Actually, let's look at the line in the file.
# Line 4850: "            ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢-šÂ¬Ã…\"Ãƒâ€šÃ‚Â  Servicing entire..."
# Search for "Servicing entire" and go back 30 bytes
# Or search for "34210 areas" and go back, but "Servicing" is better.
# Let's try searching for "Servicing entire" and then calculate manually.
# But Debug-Bytes takes a positive offset.
# Let's search for "            " (spaces) before it? Too risky.
# Let's use the file `airbnb-cleaning.html` and search for "Servicing entire" 
# but simply dump the 50 bytes BEFORE match is hard with IndexOf.
# Instead, regex select matches.

$content = [System.IO.File]::ReadAllText("house-cleaning.html")
if ($content -match "(?s)(.{20})  Servicing entire") {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($matches[1])
    Write-Host "--- Emoji Pre-Text ---"
    foreach ($b in $bytes) { Write-Host ("{0:X2} " -f $b) -NoNewline }
    Write-Host ""
    Write-Host "String: $($matches[1])"
}

# 4. Airbnb Star: "5[CORRUPTION]"
# airbnb-cleaning.html
# Search for "text-pink-300 mb-1" then look ahead or content
Debug-Bytes "airbnb-cleaning.html" 'class="text-4xl font-bold text-pink-300 mb-1">5' 48 15 "Airbnb Star"
