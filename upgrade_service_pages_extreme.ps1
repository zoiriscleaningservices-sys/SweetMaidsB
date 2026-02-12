$services = @{
    "house-cleaning.html" = "House Cleaning"
    "airbnb-cleaning.html" = "Airbnb Cleaning"
    "deep-cleaning.html" = "Deep Cleaning"
    "post-construction-cleaning.html" = "Post-Construction Cleaning"
    "commercial-cleaning.html" = "Commercial Cleaning"
    "move-in-out-cleaning.html" = "Move In/Out Cleaning"
    "pressure-washing.html" = "Pressure Washing"
    "carpet-cleaning.html" = "Carpet Cleaning"
    "window-cleaning.html" = "Window Cleaning"
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($file in $services.Keys) {
    if (Test-Path $file) {
        Write-Host "Upgrading $file with Extreme SEO Schema..."
        $content = Get-Content $file -Raw
        $serviceName = $services[$file]
        
        # 1. Alt Tag Localization (Ensure "in Bradenton" is present)
        # Regex to find alt tags that DON'T have "Bradenton"
        $content = [regex]::Replace($content, 'alt="([^"]+?)"', { 
            param($match) 
            $currentAlt = $match.Groups[1].Value
            if ($currentAlt -notmatch "Bradenton" -and $currentAlt -notmatch "Sweet Maid") {
                return 'alt="' + $currentAlt + ' in Bradenton"'
            }
            return $match.Value
        })

        # 2. Generate Extreme Schema Block
        $schemaBlock = @"
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Sweet Maid Cleaning Service",
    "image": "https://i.ibb.co/QSD3Ydt/image.jpg",
    "telephone": "941-222-2080",
    "email": "info@sweetmaidcleaning.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bradenton",
      "addressRegion": "FL",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 27.4989,
      "longitude": -82.5748
    },
    "url": "https://sweetmaidcleaning.com/$file",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
        ],
        "opens": "08:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "14:00"
      }
    ],
    "areaServed": {
      "@type": "Place",
      "name": "Bradenton, FL"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Cleaning Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "$serviceName"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Deep Cleaning"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Move-In/Out Cleaning"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "127"
    }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://sweetmaidcleaning.com/"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": "$serviceName",
      "item": "https://sweetmaidcleaning.com/$file"
    }]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is included in your $serviceName service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our $serviceName service in Bradenton includes a comprehensive checklist to ensure every corner of your home is spotless. We use eco-friendly products and professional equipment."
        }
      },
      {
        "@type": "Question",
        "name": "How much does $serviceName cost in Bradenton?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer competitive pricing for $serviceName in Bradenton. Contact us for a free, no-obligation quote tailored to your home's needs."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide $serviceName near me?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide top-rated $serviceName services throughout Bradenton, Lakewood Ranch, Sarasota, and surrounding areas."
        }
      }
    ]
  }
  </script>
"@

        # 3. Replace existing schema block
        # Look for the block starting with <!-- Local SEO Schema --> and ending with </script> (the first one)
        # Actually, the file has a block:
        # <!-- Local SEO Schema -->
        # <script type="application/ld+json"> ... </script>
        
        $pattern = '(?s)<!-- Local SEO Schema -->\s*<script type="application/ld\+json">.*?</script>'
        if ($content -match $pattern) {
            $content = [regex]::Replace($content, $pattern, "<!-- Extreme Local SEO Schema -->`n" + $schemaBlock)
        } else {
            # Fallback if comment not found, regex for just the script tag (risky if multiple, but these pages usually have one main one)
            # Let's assume the structure is consistent or just append to head if not found?
            # Better: Replace the first instance of <script type="application/ld+json">...</script> in head
            $pattern2 = '(?s)<script type="application/ld\+json">.*?</script>'
            $content = [regex]::Replace($content, $pattern2, "<!-- Extreme Local SEO Schema -->`n" + $schemaBlock, 1) 
        }

        # 4. Inject FAQ Section HTML (Optional but recommended for "Extreme" SEO)
        # Let's inject it before footer
        $faqHtml = @"
  <!-- ================================================
     FAQ SECTION ($serviceName)
=============================================== -->
  <section class="py-16 bg-pink-50">
    <div class="max-w-4xl mx-auto px-6">
      <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Common Questions about $serviceName in Bradenton</h2>
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <h3 class="font-bold text-lg text-gray-900 mb-2">What is included in your $serviceName service?</h3>
          <p class="text-gray-600">Our $serviceName service in Bradenton includes a comprehensive checklist to ensure every corner of your home is spotless. We use eco-friendly products and professional equipment.</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <h3 class="font-bold text-lg text-gray-900 mb-2">How much does $serviceName cost in Bradenton?</h3>
          <p class="text-gray-600">We offer competitive pricing for $serviceName in Bradenton. Contact us for a free, no-obligation quote tailored to your home's needs.</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <h3 class="font-bold text-lg text-gray-900 mb-2">Do you provide $serviceName near me?</h3>
          <p class="text-gray-600">Yes, we provide top-rated $serviceName services throughout Bradenton, Lakewood Ranch, Sarasota, and surrounding areas.</p>
        </div>
      </div>
    </div>
  </section>
"@
        # Insert before footer, check if generic footer start exists
        $footerTag = '<footer'
        if ($content -match $footerTag) {
            # Ensure we don't insert duplicate FAQ sections
            if ($content -notmatch "Common Questions about") {
                 $content = $content.Replace($footerTag, "$faqHtml`n$footerTag")
            }
        }

        [System.IO.File]::WriteAllText((Resolve-Path .).Path + "\$file", $content, $utf8NoBom)
    }
}

Write-Host "Extreme Service Page Upgrade Complete!"
