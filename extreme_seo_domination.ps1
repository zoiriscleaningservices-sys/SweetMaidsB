$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
$files = Get-ChildItem -Path $root -Filter "index.html" -Recurse

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

# Coordinate Mapping for targeted Florida locations
$geoMap = @{
    "Bradenton" = @{ lat = "27.4989"; lon = "-82.5748" }
    "Miami" = @{ lat = "25.7617"; lon = "-80.1918" }
    "Anna Maria" = @{ lat = "27.5300"; lon = "-82.7332" }
    "Foxleigh" = @{ lat = "27.5135"; lon = "-82.5188" }
    "Palmer Ranch" = @{ lat = "27.2389"; lon = "-82.4764" }
    "Lakewood Ranch" = @{ lat = "27.4429"; lon = "-82.4332" }
    "Osprey" = @{ lat = "27.1950"; lon = "-82.4800" }
    "University Park" = @{ lat = "27.3916"; lon = "-82.4497" }
    "Laurel" = @{ lat = "27.1439"; lon = "-82.4646" }
    "Sarasota" = @{ lat = "27.3364"; lon = "-82.5307" }
    "Longboat Key" = @{ lat = "27.3986"; lon = "-82.6433" }
    "Bradenton Beach" = @{ lat = "27.4667"; lon = "-82.6987" }
    "Nokomis" = @{ lat = "27.1234"; lon = "-82.4398" }
    "Siesta Key" = @{ lat = "27.2764"; lon = "-82.5513" }
    "Fruitville" = @{ lat = "27.3323"; lon = "-82.4654" }
    "Holmes Beach" = @{ lat = "27.5103"; lon = "-82.7165" }
    "Whitfield" = @{ lat = "27.4087"; lon = "-82.5573" }
    "Parrish" = @{ lat = "27.5855"; lon = "-82.4276" }
    "Braden River" = @{ lat = "27.4667"; lon = "-82.5115" }
    "Bee Ridge" = @{ lat = "27.2917"; lon = "-82.4937" }
    "Bayshore Gardens" = @{ lat = "27.4277"; lon = "-82.5857" }
    "Venice" = @{ lat = "27.0998"; lon = "-82.4543" }
    "The Meadows" = @{ lat = "27.3622"; lon = "-82.4705" }
    "Gulf Gate Estates" = @{ lat = "27.2570"; lon = "-82.5173" }
    "South Gate" = @{ lat = "27.3090"; lon = "-82.5176" }
    "Ellenton" = @{ lat = "27.5217"; lon = "-82.5273" }
    "Sarasota Springs" = @{ lat = "27.3236"; lon = "-82.4764" }
    "Lake Sarasota" = @{ lat = "27.2942"; lon = "-82.4404" }
    "South Sarasota" = @{ lat = "27.2520"; lon = "-82.5020" }
    "Palmetto" = @{ lat = "27.5211"; lon = "-82.5715" }
    "Palma Sola" = @{ lat = "27.4981"; lon = "-82.6373" }
    "Myakka" = @{ lat = "27.3506"; lon = "-82.1643" }
    "Bird Key" = @{ lat = "27.3193"; lon = "-82.5599" }
    "North Port" = @{ lat = "27.0442"; lon = "-82.2359" }
    "South Venice" = @{ lat = "27.0506"; lon = "-82.4278" }
    "Englewood" = @{ lat = "26.9617"; lon = "-82.3526" }
    "Rotonda West" = @{ lat = "26.8864"; lon = "-82.2684" }
    "Port Charlotte" = @{ lat = "26.9773"; lon = "-82.1051" }
    "Ruskin" = @{ lat = "27.7139"; lon = "-82.4334" }
    "Apollo Beach" = @{ lat = "27.7719"; lon = "-82.3999" }
    "Terra Ceia" = @{ lat = "27.5750"; lon = "-82.5760" }
    "Lido Key" = @{ lat = "27.3117"; lon = "-82.5768" }
    "Vamo" = @{ lat = "27.2273"; lon = "-82.4934" }
    "Sun City Center" = @{ lat = "27.7134"; lon = "-82.3551" }
    "Arcadia" = @{ lat = "27.2159"; lon = "-81.8584" }
}

$services = @{
    "house-cleaning" = "HouseCleaning"
    "deep-cleaning" = "HouseCleaning"
    "move-in-out-cleaning" = "HouseCleaning"
    "airbnb-cleaning" = "HouseCleaning"
    "commercial-cleaning" = "CommercialCleaning"
    "post-construction-cleaning" = "CommercialCleaning"
    "carpet-cleaning" = "CarpetCleaning"
    "pressure-washing" = "PressureWashing"
    "window-cleaning" = "WindowCleaning"
    "home-watch-services" = "HomeAndConstructionBusiness"
    "office-janitorial-services" = "CommercialCleaning"
    "janitorial-cleaning-services" = "CommercialCleaning"
    "medical-dental-facility-cleaning" = "CommercialCleaning"
    "industrial-warehouse-cleaning" = "CommercialCleaning"
    "floor-stripping-waxing" = "CommercialCleaning"
    "gym-fitness-center-cleaning" = "CommercialCleaning"
    "school-daycare-cleaning" = "CommercialCleaning"
    "church-worship-center-cleaning" = "CommercialCleaning"
    "property-management-janitorial" = "CommercialCleaning"
    "luxury-estate-cleaning" = "HouseCleaning"
    "solar-panel-cleaning" = "CleaningFee" # Fallback
    "gutter-cleaning" = "RoofingContractor"
    "property-maintenance" = "HomeAndConstructionBusiness"
    "airbnb-vacation-rental-management" = "RealEstateAgent"
    "luxury-estate-management" = "RealEstateAgent"
}

foreach ($file in $files) {
    if ($file.FullName -match "\\images\\" -or $file.FullName -match "\\.git\\" -or $file.FullName -contains "node_modules") { continue }
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    if ([string]::IsNullOrWhiteSpace($content)) { continue }

    $folderName = $file.Directory.Name
    $parentFolderName = $file.Directory.Parent.Name
    
    # Identify Location
    $location = ""
    $serviceSlug = ""

    if ($folderName -match "-cleaning" -and ($parentFolderName -match "-cleaning" -or $parentFolderName -match "-fl")) {
        # This is a service-at-location page like /bradenton-cleaning/house-cleaning/ or /miami-fl/house-cleaning/
        $location = $parentFolderName -replace "-cleaning", ""
        $location = $location -replace "-fl", ""
        $serviceSlug = $folderName
    } else {
        $location = $folderName -replace "-cleaning", ""
        $location = $location -replace "-fl", ""
        $serviceSlug = "house-cleaning" # Default fallback
    }
    
    $location = (Get-Culture).TextInfo.ToTitleCase($location.Replace("-", " "))
    
    if ($folderName -eq "home" -or $folderName -eq "SweetMaidsB" -or $location -eq "" -or $location -eq "House" -or $location -eq "Deep" -or $location -eq "Airbnb" -or $location -eq "Move In Out" -or $location -eq "Commercial" -or $location -eq "Post Construction" -or $location -eq "Carpet" -or $location -eq "Pressure Washing" -or $location -eq "Window") { 
        $location = "Bradenton" 
        $serviceSlug = "house-cleaning"
    }

    $schemaType = if ($services.ContainsKey($serviceSlug)) { $services[$serviceSlug] } else { "LocalBusiness" }
    
    # Check if we have coordinates
    $lat = "27.4989"
    $lon = "-82.5748"
    if ($geoMap.ContainsKey($location)) {
        $lat = $geoMap[$location].lat
        $lon = $geoMap[$location].lon
    }
    
    Write-Host "Injecting Extreme SEO Schema & Content for: $location ($folderName)"

    # Clean existing schema to avoid duplicates
    $content = [regex]::Replace($content, '(?si)<script\s+type=["'']application/ld\+json["'']>.*?</script>', "")

    # Inject Fresh, Extreme Schema
    $canonicalUrl = if ($folderName -eq "home" -or $folderName -eq "SweetMaidsB" -or $file.FullName -eq "$root\index.html") {
        "https://sweetmaidcleaning.com/"
    } elseif ($parentFolderName -ne "SweetMaidsB" -and $parentFolderName -ne "home") {
        "https://sweetmaidcleaning.com/$parentFolderName/$folderName/"
    } else {
        "https://sweetmaidcleaning.com/$folderName/"
    }

    # Ensure no double slashes like https://sweetmaidcleaning.com/miami-fl/house-cleaning//
    $canonicalUrl = $canonicalUrl -replace '([^:])//+', '$1/'
    
    # Capitalize Service Name for Schema
    $serviceName = (Get-Culture).TextInfo.ToTitleCase($serviceSlug.Replace("-", " "))

    $schema = @"
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "$schemaType"],
    "name": "Sweet Maid Cleaning Service - $serviceName in $location",
    "image": "https://i.ibb.co/QSD3Ydt/image.jpg",
    "sameAs": [
        "https://www.facebook.com/sweetmaidcleaning",
        "https://www.instagram.com/sweetmaidcleaning"
    ],
    "telephone": "(941) 222-2080",
    "email": "info@sweetmaidcleaning.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "$location",
      "addressRegion": "FL",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "$lat",
      "longitude": "$lon"
    },
    "url": "$canonicalUrl",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "16:00"
      }
    ],
    "areaServed": {
      "@type": "Place",
      "name": "$location, FL"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "168"
    }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the best $serviceName service in $location?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sweet Maid is the top-rated provider of $serviceName in $location, FL. Our team of local cleaners offers exceptional detail, eco-friendly products, and a 100% satisfaction guarantee to ensure your property is spotless."
        }
      },
      {
        "@type": "Question",
        "name": "How much does $serviceName cost in $location, FL?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The cost of $serviceName in $location varies based on the size of the property and the specific depth of cleaning required. Contact Sweet Maid for a free, instant quote to get the most accurate local pricing."
        }
      }
    ]
  }
  </script>
"@
    
    # Inject before </head>
    $content = $content -replace '(?i)</head>', "$schema`n</head>"

    # Hyper-Local Geographic SEO Paragraph Injection
    $hyperLocalBlock = @"
      <!-- HYPER-LOCAL SEO BLOCK -->
      <section class="py-12 bg-white border-t border-pink-50">
        <div class="max-w-4xl mx-auto px-6 text-center">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 font-serif">Providing Top-Tier $serviceName in $location, FL</h2>
            <p class="text-gray-600 leading-relaxed mb-4">
                As the leading provider of <strong>$serviceName</strong> in <strong>$location</strong> and the surrounding areas, Sweet Maid is dedicated to maintaining the highest cleanliness standards for your property. Whether you are located in the heart of downtown $location or in the quiet surrounding neighborhoods, our licensed and insured team is always nearby and ready to help. We understand the specific needs of $location residents and business owners and tailor our approach to deliver a reliable, spotless result every single time.
            </p>
            <p class="text-gray-600 leading-relaxed">
                Don't settle for less when it comes to the hygiene and appearance of your space in $location, FL. Join countless satisfied locals who rely on our trusted professional cleaners. <a href="#quote" class="text-pink-500 font-semibold hover:text-pink-600 underline">Get your free $location cleaning quote today!</a>
            </p>
        </div>
      </section>
      <!-- END HYPER-LOCAL SEO BLOCK -->
"@

    # Remove old hyper-local block if it exists (re-run safety)
    $content = [regex]::Replace($content, '(?si)<!-- HYPER-LOCAL SEO BLOCK -->.*?<!-- END HYPER-LOCAL SEO BLOCK -->', "")

    # Inject right before the footer
    if ($content -match '(?i)<footer') {
        $content = $content -replace '(?i)(<footer)', "$hyperLocalBlock`n`n    `$1"
    }

    [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
}

Write-Host "Extreme SEO Domination Complete!"
