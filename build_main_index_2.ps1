$ErrorActionPreference = "Stop"

$filePath = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB\index.html"
$content = [System.IO.File]::ReadAllText($filePath)

$locationsHtml = @"
  <!-- ================================================
     AREAS & MAP
=============================================== -->
  <section overflow-hidden id="areas" class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
      <div class="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">Areas We Serve</h2>
        <p class="text-lg text-gray-600">We provide top-tier cleaning services across multiple major Florida regions. Find your city below!</p>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Tampa Area -->
          <div class="glass-card p-8 rounded-3xl text-center group hover:-translate-y-2 transition-transform duration-300 shadow-lg border border-pink-100" data-aos="fade-up" data-aos-delay="100">
              <div class="w-16 h-16 mx-auto bg-pink-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-map-location-dot text-2xl text-pink-500"></i>
              </div>
              <h3 class="text-xl font-bold mb-4 font-serif text-gray-900">Tampa Area</h3>
              <ul class="text-sm text-gray-600 space-y-2">
                  <li><a href="/tampa-fl/" class="hover:text-pink-500">Tampa</a></li>
                  <li><a href="/carrollwood-fl/" class="hover:text-pink-500">Carrollwood</a></li>
                  <li><a href="/lutz-fl/" class="hover:text-pink-500">Lutz</a></li>
                  <li><a href="/apollo-beach-fl/" class="hover:text-pink-500">Apollo Beach</a></li>
                  <li><a href="/fishhawk-fl/" class="hover:text-pink-500">FishHawk</a></li>
                  <li><a href="/south-tampa-fl/" class="hover:text-pink-500">South Tampa</a></li>
              </ul>
          </div>
          
          <!-- Miami Area -->
          <div class="glass-card p-8 rounded-3xl text-center group hover:-translate-y-2 transition-transform duration-300 shadow-lg border border-pink-100" data-aos="fade-up" data-aos-delay="200">
              <div class="w-16 h-16 mx-auto bg-pink-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-tree-city text-2xl text-pink-500"></i>
              </div>
              <h3 class="text-xl font-bold mb-4 font-serif text-gray-900">Miami Area</h3>
              <ul class="text-sm text-gray-600 space-y-2">
                  <li><a href="/miami-fl/" class="hover:text-pink-500">Miami</a></li>
                  <li><a href="/miami-beach-fl/" class="hover:text-pink-500">Miami Beach</a></li>
                  <li><a href="/coral-gables-fl/" class="hover:text-pink-500">Coral Gables</a></li>
                  <li><a href="/brickell-fl/" class="hover:text-pink-500">Brickell</a></li>
                  <li><a href="/pinecrest-fl/" class="hover:text-pink-500">Pinecrest</a></li>
                  <li><a href="/aventura-fl/" class="hover:text-pink-500">Aventura</a></li>
              </ul>
          </div>
          
          <!-- The Florida Keys -->
          <div class="glass-card p-8 rounded-3xl text-center group hover:-translate-y-2 transition-transform duration-300 shadow-lg border border-pink-100" data-aos="fade-up" data-aos-delay="300">
              <div class="w-16 h-16 mx-auto bg-pink-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-umbrella-beach text-2xl text-pink-500"></i>
              </div>
              <h3 class="text-xl font-bold mb-4 font-serif text-gray-900">The Florida Keys</h3>
              <ul class="text-sm text-gray-600 space-y-2">
                  <li><a href="/the-florida-keys-fl/" class="hover:text-pink-500">The Florida Keys</a></li>
                  <li><a href="/key-west-fl/" class="hover:text-pink-500">Key West</a></li>
                  <li><a href="/key-largo-fl/" class="hover:text-pink-500">Key Largo</a></li>
                  <li><a href="/marathon-fl/" class="hover:text-pink-500">Marathon</a></li>
                  <li><a href="/islamorada-fl/" class="hover:text-pink-500">Islamorada</a></li>
              </ul>
          </div>
          
          <!-- Bradenton & Sarasota -->
          <div class="glass-card p-8 rounded-3xl text-center group hover:-translate-y-2 transition-transform duration-300 shadow-lg border border-pink-100" data-aos="fade-up" data-aos-delay="400">
              <div class="w-16 h-16 mx-auto bg-pink-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-sun text-2xl text-pink-500"></i>
              </div>
              <h3 class="text-xl font-bold mb-4 font-serif text-gray-900">Bradenton & Sarasota</h3>
              <ul class="text-sm text-gray-600 space-y-2">
                  <li><a href="/bradenton-cleaning/" class="hover:text-pink-500">Bradenton</a></li>
                  <li><a href="/sarasota-cleaning/" class="hover:text-pink-500">Sarasota</a></li>
                  <li><a href="/lakewood-ranch-cleaning/" class="hover:text-pink-500">Lakewood Ranch</a></li>
                  <li><a href="/venice-cleaning/" class="hover:text-pink-500">Venice</a></li>
                  <li><a href="/palmetto-cleaning/" class="hover:text-pink-500">Palmetto</a></li>
                  <li><a href="/anna-maria-cleaning/" class="hover:text-pink-500">Anna Maria</a></li>
              </ul>
          </div>
      </div>
    </div>
  </section>
"@

$regex = '(?s)<!-- ================================================\s*AREAS & MAP\s*=============================================== -->\s*<section overflow-hidden id="areas".*?</section>'
$content = $content -replace $regex, $locationsHtml

[System.IO.File]::WriteAllText($filePath, $content, (New-Object System.Text.UTF8Encoding $false))

Write-Host "Replaced areas section."
