$content = [System.IO.File]::ReadAllText("home/index.html")

$pos = $content.IndexOf("34205, 34209")
if ($pos -ge 0) {
    Write-Host "Context found"
    $start = $pos - 32
    $sub = $content.Substring($start, 32)
    for ($i=0; $i -lt $sub.Length; $i++) {
        $ch = $sub[$i]
        $code = [int]$ch
        Write-Host "Pos" $i "Char" $ch "Code" $code
    }
}
