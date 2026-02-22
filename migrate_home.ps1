$ErrorActionPreference = "Stop"

$homeFile = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB\home\index.html"
$targetFile = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB\bradenton-fl\index.html"

$content = [System.IO.File]::ReadAllText($homeFile)

# Update logo link to stay in bradenton-fl silo (actually it can just be the silo root)
$content = $content -replace 'href="#" onclick="window.scrollTo\(\{top: 0, behavior: ''smooth''\}\); return false;"', 'href="/bradenton-fl/"'

$services = @(
    "airbnb-cleaning", "airbnb-vacation-rental-management", "carpet-cleaning", 
    "church-worship-center-cleaning", "commercial-cleaning", "deep-cleaning", 
    "floor-stripping-waxing", "gutter-cleaning", "gym-fitness-center-cleaning", 
    "home-watch-services", "house-cleaning", "industrial-warehouse-cleaning", 
    "janitorial-cleaning-services", "luxury-estate-cleaning", "luxury-estate-management", 
    "medical-dental-facility-cleaning", "move-in-out-cleaning", "office-janitorial-services", 
    "post-construction-cleaning", "pressure-washing", "property-maintenance", 
    "property-management-janitorial", "school-daycare-cleaning", "solar-panel-cleaning", 
    "window-cleaning"
)

foreach ($srv in $services) {
    # Replace root links in the carousel and menu
    $content = $content.Replace("href=`"/$srv/`"", "href=`"/bradenton-fl/$srv/`"")
}

# Fix about and gallery
$content = $content.Replace("href=`"/about/`"", "href=`"/bradenton-fl/about/`"")
$content = $content.Replace("href=`"/gallery/`"", "href=`"/bradenton-fl/gallery/`"")

$servicesGrid = @"
  <!-- ================================================
     ALL SERVICES 
=============================================== -->
  <section overflow-hidden id="all-services" class="py-24 bg-white relative">
    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
      <div class="text-center mb-16" data-aos="fade-up">
        <span class="text-pink-300 font-bold tracking-widest uppercase text-xs">Complete Cleaning Solutions</span>
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">All Services We Offer in Bradenton</h2>
        <p class="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Explore our full range of 25+ professional cleaning and property management services.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="100">
"@

foreach ($srv in $services) {
    $words = $srv.Split("-")
    $capitalizedWords = $words | ForEach-Object { 
        (Get-Culture).TextInfo.ToTitleCase($_) 
    }
    $name = $capitalizedWords -join " "
    $name = $name -replace " And ", " & "
    $name = $name -replace "In Out", "In/Out"
    
    $servicesGrid += @"
        <a href="/bradenton-fl/$srv/" class="group flex items-center p-5 bg-slate-50 rounded-2xl border border-pink-50 hover:border-pink-300 hover:shadow-lg transition-all transform hover:-translate-y-1">
          <div class="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mr-4 group-hover:bg-pink-300 group-hover:text-white transition-colors">
            <i class="fa-solid fa-sparkles"></i>
          </div>
          <span class="text-base font-bold text-gray-800 group-hover:text-pink-600 transition-colors">$name</span>
        </a>
"@
}

$servicesGrid += @"
      </div>
    </div>
  </section>
"@

$insertRegex = '(?s)  <!-- ================================================\s+ECO-FRIENDLY COMMITMENT'
$replacement = "$servicesGrid`n  <!-- ================================================`n     ECO-FRIENDLY COMMITMENT"

if ($content -match $insertRegex) {
    $content = $content -replace $insertRegex, $replacement
    Write-Host "Successfully injected All Services section."
} else {
    Write-Host "Warning: Could not find ECO-FRIENDLY COMMITMENT marker to insert All Services."
}

[System.IO.File]::WriteAllText($targetFile, $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Migration complete to $targetFile"
