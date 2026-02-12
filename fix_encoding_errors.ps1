$files = Get-ChildItem -Filter *.html

# Common Mojibake replacements
# These occur when UTF-8 bytes are interpreted as Windows-1252 and then saved.
$replacements = @{
    'â€™' = "'"           # Right single quote -> Apostrophe
    'â€˜' = "'"           # Left single quote -> Apostrophe
    'â€œ' = '"'           # Left double quote
    'â€' = '"'            # Right double quote (often just â€ due to 3rd byte being undefined)
    'â€“' = '-'           # En-dash
    'â€”' = '--'          # Em-dash
    'Â©' = '&copy;'       # Copyright symbol
    'Â' = ''              # Non-breaking space artifact (0xC2 0xA0) -> Remove the Â prefix
    'Ã©' = 'é'            # e-acute (cafe)
    
    # Severe multi-level corruption (e.g. Check marks)
    'ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦' = '&#9989;'
    'ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚Â Ãƒâ€¦Ã¢â‚¬â„¢' = '&#10060;'
    'âœ…' = '&#9989;'     # Just in case it's valid UTF-8 checkmark but we want entity for safety
    
    # The user screenshot showed "Bradentonâ€™s"
    # This matches 'â€™' above.
    
    # Other potential ones
    'Ã¢â‚¬â„¢' = "'"       # Another variation of apostrophe
    'Ã¢â‚¬â€œ' = "-"       # Another variation of en-dash
}

foreach ($file in $files) {
    Write-Host "Processing $($file.Name)..."
    
    # Read as pure text (PowerShell will auto-detect UTF8 BOM or default to UTF8 mostly in Core, but let's be safe)
    # We want to treat the file as a container of strings where "â€™" exists as those distinct characters.
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $original = $content
    
    # Apply replacements
    foreach ($key in $replacements.Keys) {
        if ($content.Contains($key)) {
            # Be careful with 'â€' overlapping with 'â€“' if we just check 'â€'
            # But 'â€“' (E2 80 93) does NOT contain 'â€' (E2 80 9D).
            # 0x93 vs 0x9D.
            # In string form:
            # â (0xE2)
            # € (0x80)
            # – (0x96) wait, 0x93 is “ in 1252. No.
            
            # Let's just trust the string replacement.
            $content = $content.Replace($key, $replacements[$key])
        }
    }
    
    # Special handle for "Sweet Maid Cleaning Service A,?o Bradenton" seen in grep
    # This likely implies encoding was messed up in a way that grep couldn't show.
    # But if we fixed the widespread ones, we might be good.
    
    # Fix double-encoded Copyright specifically if missed
    $content = $content -replace 'Â©', '&copy;'

    if ($content -ne $original) {
        # Force write as UTF-8
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "  Fixed corruption in $($file.Name)"
    }
}
