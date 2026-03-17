$baseUrl = "https://sweetmaidcleaning.com"
$sitemapFile = "sitemap.xml"
$robotsFile = "robots.txt"

# 1. Define Pages
$pages = @(
    "index.html",
    "house-cleaning.html",
    "airbnb-cleaning.html",
    "deep-cleaning.html",
    "post-construction-cleaning.html",
    "commercial-cleaning.html",
    "move-in-out-cleaning.html",
    "pressure-washing.html",
    "carpet-cleaning.html",
    "window-cleaning.html",
    "about.html",
    "blog.html",
    "gallery.html"
)

# 2. Get Location Pages
$locationPages = Get-ChildItem -Path . -Filter "*-cleaning.html" | Where-Object { 
    $_.Name -notin $pages 
} | Select-Object -ExpandProperty Name

$allPages = $pages + $locationPages

# 3. Build Sitemap XML
$xml = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
"@

foreach ($page in $allPages) {
    if (Test-Path $page) {
        $lastMod = (Get-Item $page).LastWriteTime.ToString("yyyy-MM-dd")
        $priority = if ($page -eq "index.html") { "1.0" } elseif ($page -in $pages) { "0.9" } else { "0.8" }
        $changeFreq = "daily"
        
        # Determine URL (strip index.html for root)
        $urlPath = if ($page -eq "index.html") { "" } else { $page }
        $fullUrl = "$baseUrl/$urlPath"

        $xml += @"

  <url>
    <loc>$fullUrl</loc>
    <lastmod>$lastMod</lastmod>
    <changefreq>$changeFreq</changefreq>
    <priority>$priority</priority>
  </url>
"@
    }
}

$xml += @"

</urlset>
"@

[System.IO.File]::WriteAllText((Resolve-Path .).Path + "\$sitemapFile", $xml, [System.Text.Encoding]::UTF8)
Write-Host "Sitemap Generated successfully with $( $allPages.Count ) URLs!"

# 4. Build Robots.txt
$robotsTxt = @"
User-agent: *
Allow: /
Sitemap: $baseUrl/sitemap.xml

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
"@

[System.IO.File]::WriteAllText((Resolve-Path .).Path + "\$robotsFile", $robotsTxt, [System.Text.Encoding]::UTF8)
Write-Host "Robots.txt Generated!"
