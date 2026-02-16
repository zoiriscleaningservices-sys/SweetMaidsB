$baseUrl = "https://sweetmaidcleaning.com"
$sitemapFile = "sitemap.xml"

$xml = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
"@

# Get all index.html files
$items = Get-ChildItem -Recurse -Filter "index.html" | Where-Object { 
    $_.FullName -notmatch ".git" -and 
    $_.FullName -notmatch "brain" -and
    $_.FullName -notmatch "node_modules"
}

foreach ($item in $items) {
    $lastMod = $item.LastWriteTime.ToString("yyyy-MM-dd")
    
    # Get relative path
    $relPath = $item.DirectoryName.Replace((Resolve-Path .).Path, "").Replace("\", "/").Trim("/")
    
    # Normalize URL path
    $urlPath = if ($relPath -eq "") { "" } else { "$relPath/" }
    
    # Priority Logic
    $priority = "0.6"
    if ($urlPath -eq "") { $priority = "1.0" }
    elseif ($urlPath -eq "home/") { $priority = "1.0" }
    elseif ($urlPath -match "^[a-z-]+-cleaning/$") { $priority = "0.9" } # Main location pages
    elseif ($urlPath -match "/[a-z-]+-cleaning/$") { $priority = "0.8" } # Hyper-local service pages
    
    $fullUrl = "$baseUrl/$urlPath"

    $xml += @"

  <url>
    <loc>$fullUrl</loc>
    <lastmod>$lastMod</lastmod>
    <changefreq>weekly</changefreq>
    <priority>$priority</priority>
  </url>
"@
}

$xml += @"

</urlset>
"@

[System.IO.File]::WriteAllText((Resolve-Path .).Path + "\$sitemapFile", $xml, [System.Text.Encoding]::UTF8)
Write-Host "Extended Sitemap Generated with $( ($xml -split '<url>').Count - 1 ) URLs!"
