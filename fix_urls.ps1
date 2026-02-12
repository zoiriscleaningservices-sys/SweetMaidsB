$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
$files = Get-ChildItem -Path $root -Filter "index.html" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Fix 1: Remove leading slash from absolute URLs in href and content attributes
    # e.g. href="/https://..." -> href="https://..."
    $content = $content -replace 'href="/(https?://)', 'href="$1'
    $content = $content -replace 'content="/(https?://)', 'content="$1'
    
    # Fix 2: Update JSON-LD "url" fields that still have .html
    # "url": "https://sweetmaidcleaning.com/about.html" -> "url": "https://sweetmaidcleaning.com/about/"
    # We use a lookbehind or specific pattern for "url": "..."
    $content = $content -replace '"url":\s*"(https?://[^"]+)\.html"', '"url": "$1/"'
    
    # Fix 3: Clean up any double slashes that might have occurred in paths (rare but possible id refs)
    # e.g. href="//home/" -> href="/home/" (only if it starts with // and not protocol)
    # Careful not to break protocol //
    $content = $content -replace 'href="//([^/])', 'href="/$1'

    Set-Content -Path $file.FullName -Value $content
}

Write-Host "Malformed URL Fixes Complete"
