$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
$files = Get-ChildItem -Path $root -Filter "index.html" -Recurse

# TARGET: Mailbox icon (accidental) and original artifact
$p_mailbox = "" + [char]55357 + [char]56557
$p_pin_artifact = "" + [char]195 + [char]176 + [char]197 + [char]226 + [char]8364 + [char]339 + [char]141
$r_pin = "" + [char]55357 + [char]56525 # 📍 (U+1F4CD)

Write-Host "Executing THE CORRECTED Surgical Pin Repair..."

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($file in $files) {
    if ($file.FullName -match "\\(\.git|\.gemini|node_modules|images|css|js)\\") { continue }
    
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $originalContent = $content

    $content = $content.Replace($p_mailbox, $r_pin)
    $content = $content.Replace($p_pin_artifact, $r_pin)

    if ($content -ne $originalContent) {
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
    }
}

Write-Host "Corrected Surgical Pin Repair Complete."
