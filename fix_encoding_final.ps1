$files = Get-ChildItem -Filter *.html

# Helper to create string from bytes
function BytesToString($bytes) {
    return [System.Text.Encoding]::UTF8.GetString($bytes)
}

$replacements = @{}

# 1. resourceÃ¢â‚¬â€time -> resource - time
# Sequence: C3 83 C2 A2 C3 A2 E2 80 9A C2 AC C3 A2 E2 82 AC C2 9D
# This is explicitly the triple-encoded em-dash from about.html
$bad_dash = BytesToString([byte[]]@(0xC3, 0x83, 0xC2, 0xA2, 0xC3, 0xA2, 0xE2, 0x80, 0x9A, 0xC2, 0xAC, 0xC3, 0xA2, 0xE2, 0x82, 0xAC, 0xC2, 0x9D))
$replacements[$bad_dash] = ' - '

# Also just "resource" followed by that mess
# I will just replace the mess globally.

# 2. Triple encoded Copyright?
# Identified as `A,&copy;` in string view or `ÃƒÆ’...`
# I will use a regex for this one to be safe.

foreach ($file in $files) {
    Write-Host "Processing $($file.Name)..."
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $original = $content
    
    # Apply Byte Replacements (Exact Sequences)
    foreach ($key in $replacements.Keys) {
        if ($content.Contains($key)) {
            Write-Host "  Found byte corruption, replacing..."
            $content = $content.Replace($key, $replacements[$key])
        }
    }
    
    # Regex Fix for Footer Copyright
    # Replace anything before "2025 Sweet Maid" on that line with "&copy;"
    # Look for: (spaces) (garbage) 2025 Sweet Maid
    # Replace with: (spaces) &copy; 2025 Sweet Maid
    
    # We use regex matching the year and the text
    # Capture the indentation
    $pattern = '(?m)^(\s+).*2025 Sweet Maid Cleaning Service'
    if ($content -match $pattern) {
         # Replace the whole match with indentation + &copy; + Rest
         # Note: The pattern matches the whole line up to "Service"
         # So we need to reconstruct it.
         
         $content = [regex]::Replace($content, '(?m)^(\s+).*?(?=2025 Sweet Maid)', '$1&copy; ')
    }
    
    # Also manual fix for "A,&copy;" just in case regex misses
    if ($content.Contains("A,&copy;")) {
        $content = $content.Replace("A,&copy;", "&copy;")
    }

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "  Fixed."
    }
}
