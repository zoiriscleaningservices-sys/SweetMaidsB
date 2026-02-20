$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
$files = Get-ChildItem -Path $root -Filter "index.html" -Recurse

# Define the NEW "Our Services" Footer Block
$newServicesBlock = @"
        <div>
          <h4 class="text-gray-800 font-bold text-lg mb-6 flex items-center gap-2">
            <span class="w-1 h-6 bg-pink-300 rounded-full"></span>Our Services
          </h4>
          <div class="grid grid-cols-1 gap-y-2 text-xs">
            <ul class="space-y-2">
              <li><a href="/house-cleaning/" class="hover:text-pink-400 transition-colors">House Cleaning</a></li>
              <li><a href="/deep-cleaning/" class="hover:text-pink-400 transition-colors">Deep Cleaning</a></li>
              <li><a href="/airbnb-cleaning/" class="hover:text-pink-400 transition-colors">Airbnb Cleaning</a></li>
              <li><a href="/move-in-out-cleaning/" class="hover:text-pink-400 transition-colors">Move In/Out Cleaning</a></li>
              <li><a href="/home-watch-services/" class="hover:text-pink-400 transition-colors">Home Watch</a></li>
              <li><a href="/luxury-estate-cleaning/" class="hover:text-pink-400 transition-colors">Luxury Estate Cleaning</a></li>
              <li><a href="/luxury-estate-management/" class="hover:text-pink-400 transition-colors">Luxury Estate Mgmt</a></li>
              <li><a href="/airbnb-vacation-rental-management/" class="hover:text-pink-400 transition-colors">Airbnb & Rental Mgmt</a></li>
              <li><a href="/commercial-cleaning/" class="hover:text-pink-400 transition-colors">Commercial Cleaning</a></li>
              <li><a href="/office-janitorial-services/" class="hover:text-pink-400 transition-colors">Office Janitorial</a></li>
              <li><a href="/janitorial-cleaning-services/" class="hover:text-pink-400 transition-colors">Janitorial Services</a></li>
              <li><a href="/medical-dental-facility-cleaning/" class="hover:text-pink-400 transition-colors">Medical & Dental</a></li>
              <li><a href="/industrial-warehouse-cleaning/" class="hover:text-pink-400 transition-colors">Industrial & Warehouse</a></li>
              <li><a href="/gym-fitness-center-cleaning/" class="hover:text-pink-400 transition-colors">Gym & Fitness Center</a></li>
              <li><a href="/school-daycare-cleaning/" class="hover:text-pink-400 transition-colors">School & Daycare</a></li>
              <li><a href="/church-worship-center-cleaning/" class="hover:text-pink-400 transition-colors">Church & Worship</a></li>
              <li><a href="/property-management-janitorial/" class="hover:text-pink-400 transition-colors">Property Mgmt Janitorial</a></li>
              <li><a href="/post-construction-cleaning/" class="hover:text-pink-400 transition-colors">Post-Construction</a></li>
              <li><a href="/pressure-washing/" class="hover:text-pink-400 transition-colors">Pressure Washing</a></li>
              <li><a href="/carpet-cleaning/" class="hover:text-pink-400 transition-colors">Carpet Cleaning</a></li>
              <li><a href="/window-cleaning/" class="hover:text-pink-400 transition-colors">Window Cleaning</a></li>
              <li><a href="/floor-stripping-waxing/" class="hover:text-pink-400 transition-colors">Floor Strip/Wax</a></li>
              <li><a href="/solar-panel-cleaning/" class="hover:text-pink-400 transition-colors">Solar Panels</a></li>
              <li><a href="/gutter-cleaning/" class="hover:text-pink-400 transition-colors">Gutter Cleaning</a></li>
              <li><a href="/property-maintenance/" class="hover:text-pink-400 transition-colors text-xs">Property Maintenance</a></li>
            </ul>
          </div>
        </div>
"@

# Regex to find the existing Services block in the footer
# Search for the block starting with "Our Services" inside the 5-column grid
$pattern = '(?s)<div>\s+<h4 class="text-gray-800 font-bold text-lg mb-6 flex items-center gap-2">\s+<span class="w-1 h-6 bg-pink-300 rounded-full"></span>Our Services\s+</h4>\s+<ul class="space-y-3">.*?</ul>\s+</div>'

Write-Host "Rolling out SITE-WIDE GLOBAL FOOTER UPGRADE..."

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($file in $files) {
    if ($file.FullName -match "\\(\.git|\.gemini|node_modules|images|css|js)\\") { continue }
    
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $originalContent = $content

    # Match and replace the services block
    if ($content -match $pattern) {
        $content = [regex]::Replace($content, $pattern, $newServicesBlock)
    }

    if ($content -ne $originalContent) {
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
    }
}

Write-Host "Global Footer Upgrade Complete."
