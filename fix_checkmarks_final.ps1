$targetFile = "house-cleaning.html"
$content = [System.IO.File]::ReadAllText($targetFile)

# Fix 1: Checkmark (Success Message)
# Look for the line with "Thanks!" and extract the garbage before it.
$successPattern = '([^\s>]+)\s+Thanks!'
$matchSuccess = [regex]::Match($content, $successPattern)

if ($matchSuccess.Success) {
    $badCheckmark = $matchSuccess.Groups[1].Value
    Write-Host "Detailed Checkmark Corruption Found: $badCheckmark"
    
    # Replacement for Checkmark
    $replacementCheck = '&#9989;'
    
    $allFiles = Get-ChildItem -Filter *.html
    foreach ($file in $allFiles) {
        $txt = [System.IO.File]::ReadAllText($file.FullName)
        if ($txt.Contains($badCheckmark)) {
            $txt = $txt.Replace($badCheckmark, $replacementCheck)
            [System.IO.File]::WriteAllText($file.FullName, $txt, [System.Text.Encoding]::UTF8)
            Write-Host "  Fixed Checkmark in $($file.Name)"
        }
    }
} else {
    Write-Host "Could not find Checkmark corruption pattern."
}

# Fix 2: Cross Mark (Error Message)
# Look for the line with "Oops!" and extract the garbage before it.
$errorPattern = '([^\s>]+)\s+Oops!'
$matchError = [regex]::Match($content, $errorPattern)

if ($matchError.Success) {
    $badCross = $matchError.Groups[1].Value
    Write-Host "Detailed Cross Mark Corruption Found: $badCross"
    
    # Replacement for Cross Mark
    $replacementCross = '&#10060;'
    
    $allFiles = Get-ChildItem -Filter *.html
    foreach ($file in $allFiles) {
        $txt = [System.IO.File]::ReadAllText($file.FullName)
        if ($txt.Contains($badCross)) {
            $txt = $txt.Replace($badCross, $replacementCross)
            [System.IO.File]::WriteAllText($file.FullName, $txt, [System.Text.Encoding]::UTF8)
            Write-Host "  Fixed Cross Mark in $($file.Name)"
        }
    }
} else {
    Write-Host "Could not find Cross Mark corruption pattern."
}
