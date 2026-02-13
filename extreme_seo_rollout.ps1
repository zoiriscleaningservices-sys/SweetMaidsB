$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
$files = Get-ChildItem -Path $root -Filter "index.html" -Recurse

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($file in $files) {
    if ($file.FullName -match "\\images\\" -or $file.FullName -match "\\.git\\" -or $file.FullName -contains "node_modules") { continue }
    
    $content = Get-Content $file.FullName -Raw
    if ([string]::IsNullOrWhiteSpace($content)) { continue }

    $folderName = $file.Directory.Name
    
    # Identify Location
    $location = $folderName -replace "-cleaning", ""
    $location = (Get-Culture).TextInfo.ToTitleCase($location.Replace("-", " "))
    
    if ($folderName -eq "home" -or $folderName -eq "SweetMaidsB") { $location = "Bradenton" }
    
    Write-Host "Optimizing SEO for: $location ($folderName)"

    # 1. Update Title (Extreme Pattern)
    $newTitle = "#1 Rated Cleaning Service in $location, FL | Sweet Maid Cleaning"
    $content = [regex]::Replace($content, '(?si)<title>.*?</title>', "<title>$newTitle</title>")

    # 2. Update Description (Extreme Pattern)
    $newDesc = "Looking for the best cleaning service in $location, FL? Sweet Maid offers top-rated house cleaning, deep cleaning, and move-out services. Licensed, insured, and 100% satisfaction guaranteed. Book your sparkle today!"
    $patternDesc = '(?si)<meta\s+name=["'']description["'']\s+content=["''].*?["''].*?>'
    $replaceDesc = "<meta name=`"description`" content=`"$newDesc`" />"
    $content = [regex]::Replace($content, $patternDesc, $replaceDesc)

    # 3. Clean existing schema to avoid duplicates
    $content = [regex]::Replace($content, '(?si)<script\s+type=["'']application/ld\+json["'']>.*?</script>', "")

    # 4. Inject Fresh, Extreme Schema
    $schema = @"
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Sweet Maid Cleaning Service - $location",
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
      "latitude": "27.4989",
      "longitude": "-82.5748"
    },
    "url": "https://sweetmaidcleaning.com/$folderName/",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
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
      "reviewCount": "150"
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
        "name": "What is the best cleaning service in $location?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sweet Maid is widely considered the #1 rated cleaning service in $location, FL, known for exceptional detail, eco-friendly products, and a 100% satisfaction guarantee."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a house cleaning cost in $location?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cleaning costs in $location vary by home size and service type. We offer free, instant quotes via phone or our online form to provide you with the most accurate pricing."
        }
      }
    ]
  }
  </script>
"@
    
    # Inject before </head>
    $content = $content -replace '(?i)</head>', "$schema`n</head>"

    # 5. Handle Canonical Tag
    $content = [regex]::Replace($content, '(?si)<link\s+rel=["'']canonical["''].*?>', "")
    $canonical = "<link rel=`"canonical`" href=`"https://sweetmaidcleaning.com/$folderName/`" />"
    $content = $content -replace '(?i)<head>', "<head>`n  $canonical"

    [System.IO.File]::WriteAllText($file.FullName, $content, $utf8NoBom)
}

Write-Host "Extreme SEO Rollout Complete."
