
function Get-HexBytes($file, $markerBytes, $offset) {
    if (-not (Test-Path $file)) { return "File not found" }
    $bytes = [System.IO.File]::ReadAllBytes($file)
    
    for ($i = 0; $i -lt $bytes.Length - $markerBytes.Length; $i++) {
        $match = $true
        for ($j = 0; $j -lt $markerBytes.Length; $j++) {
            if ($bytes[$i + $j] -ne $markerBytes[$j]) { $match = $false; break }
        }
        
        if ($match) {
            # Marker found.
            # For Emoji: Marker is "Servicing entire". Corruption is BEFORE.
            # For Star: Marker is "5". Corruption is AFTER.
            
            $start = $i + $offset
            # Grab 30 bytes
            $len = 30
            if ($start + $len -gt $bytes.Length) { $len = $bytes.Length - $start }
            if ($start -lt 0) { $len = $len + $start; $start = 0 }
            
            $segment = $bytes[$start..($start+$len-1)]
            $hex = ($segment | ForEach-Object { "0x{0:X2}" -f $_ }) -join ", "
            return $hex
        }
    }
    return "Marker not found"
}

# Airbnb Star: "5" (0x35) followed by corruption
# Look for 'text-pink-300 mb-1">5'
$markerStar = [System.Text.Encoding]::UTF8.GetBytes('text-pink-300 mb-1">5')
$hexStar = Get-HexBytes "airbnb-cleaning.html" $markerStar $markerStar.Length
Write-Host "Airbnb Star Hex: $hexStar"

# Emoji: Corruption followed by "  Servicing entire"
# Marker "  Servicing entire"
$markerEmoji = [System.Text.Encoding]::UTF8.GetBytes("  Servicing entire")
# Go back 20 bytes?
$hexEmoji = Get-HexBytes "house-cleaning.html" $markerEmoji -20
Write-Host "Emoji Hex: $hexEmoji"
