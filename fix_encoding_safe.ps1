$files = Get-ChildItem -Filter *.html

# Helper to create string from bytes
function BytesToString($bytes) {
    return [System.Text.Encoding]::UTF8.GetString($bytes)
}

$replacements = @{}

# 1. â€™ (from Smart Quote ’) -> '
$bad = BytesToString([byte[]]@(0xC3, 0xA2, 0xE2, 0x82, 0xAC, 0xE2, 0x84, 0xA2))
$replacements[$bad] = "'"

# 2. â€“ (En dash) -> - 
$bad = BytesToString([byte[]]@(0xC3, 0xA2, 0xE2, 0x82, 0xAC, 0xE2, 0x80, 0x9C))
$replacements[$bad] = '-'  

# 3. Ã¢â‚¬" (Triple encoding of En-dash?) -> -
# Sequence: Ã (C3 83) ¢ (C2 A2) â (C3 A2) € (E2 82 AC) " (22)
$bad_triple = BytesToString([byte[]]@(0xC3, 0x83, 0xC2, 0xA2, 0xC3, 0xA2, 0xE2, 0x82, 0xAC, 0x22))
$replacements[$bad_triple] = ' - '

# 4. Ã¢â‚¬ (Triple encoding of something else?) -> -
# Sequence: Ã (C3 83) ¢ (C2 A2) â (C3 A2) € (E2 82 AC)
$bad_triple2 = BytesToString([byte[]]@(0xC3, 0x83, 0xC2, 0xA2, 0xC3, 0xA2, 0xE2, 0x82, 0xAC))
$replacements[$bad_triple2] = '-'

# 5. â€œ (from “) -> "
$bad_quote = BytesToString([byte[]]@(0xC3, 0xA2, 0xE2, 0x82, 0xAC, 0xC5, 0x93))
$replacements[$bad_quote] = '"'

# Â© -> &copy;
$bad = BytesToString([byte[]]@(0xC3, 0x82, 0xC2, 0xA9))
$replacements[$bad] = '&copy;'

# Â (Nbsp) -> Space
$bad = BytesToString([byte[]]@(0xC3, 0x82, 0xC2, 0xA0))
$replacements[$bad] = ' '
$bad2 = BytesToString([byte[]]@(0xC3, 0x82, 0x20))
$replacements[$bad2] = ' '


foreach ($file in $files) {
    Write-Host "Processing $($file.Name)..."
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $original = $content
    
    foreach ($key in $replacements.Keys) {
        if ($content.Contains($key)) {
            Write-Host "  Found corrupted sequence, replacing..."
            $content = $content.Replace($key, $replacements[$key])
        }
    }
    
    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "  Fixed."
    }
}
