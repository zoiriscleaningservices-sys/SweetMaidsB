$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
$files = Get-ChildItem -Path $root -Filter "index.html" -Recurse

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$footerHtml = @'
  <footer class="relative bg-gradient-to-br from-pink-50 via-pink-100 to-pink-50 text-gray-700 pt-24 pb-12 overflow-hidden">
    <div class="absolute inset-0 opacity-30">
      <div class="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
    </div>
    <div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
      <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
        <div class="lg:col-span-2">
          <div class="mb-6">
            <img src="https://i.ibb.co/PzPDfC1N/Whats-App-Image-2026-02-09-at-4-52-59-PM-Picsart-Background-Remover.png" alt="Sweet Maid Cleaning Service" class="h-24 w-auto object-contain">
          </div>
          <p class="text-gray-700 leading-relaxed mb-6">Southwest Florida's most trusted cleaning service. We bring joy, sparkle, and peace of mind to every home we touch.</p>
          <div class="flex flex-wrap gap-3">
            <a href="https://www.facebook.com/SweetMaidCleaningService/" target="_blank" class="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center hover:bg-pink-300 transition-all"><i class="fab fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/sweetmaidcleaningservice/" target="_blank" class="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center hover:bg-pink-300 transition-all"><i class="fab fa-instagram"></i></a>
            <a href="https://wa.me/16452176738" target="_blank" class="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center hover:bg-pink-300 transition-all"><i class="fab fa-whatsapp"></i></a>
          </div>
        </div>
        <div>
          <h4 class="text-gray-800 font-bold text-lg mb-6 flex items-center gap-2">
            <span class="w-1 h-6 bg-pink-300 rounded-full"></span>Our Services
          </h4>
          <ul class="space-y-3">
            <li><a href="/house-cleaning/" class="hover:text-pink-400 transition-colors">House Cleaning</a></li>
            <li><a href="/deep-cleaning/" class="hover:text-pink-400 transition-colors">Deep Cleaning</a></li>
            <li><a href="/airbnb-cleaning/" class="hover:text-pink-400 transition-colors">Airbnb Cleaning</a></li>
            <li><a href="/move-in-out-cleaning/" class="hover:text-pink-400 transition-colors">Move In/Out</a></li>
            <li><a href="/commercial-cleaning/" class="hover:text-pink-400 transition-colors">Commercial</a></li>
            <li><a href="/carpet-cleaning/" class="hover:text-pink-400 transition-colors">Carpet Cleaning</a></li>
          </ul>
        </div>
        <div class="lg:col-span-2">
          <h4 class="text-gray-800 font-bold text-lg mb-6 flex items-center gap-2">
            <span class="w-1 h-6 bg-pink-300 rounded-full"></span>Locations We Serve
          </h4>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs">
            <a href="/bradenton-cleaning/" class="hover:text-pink-400 transition-colors">Bradenton</a>
            <a href="/anna-maria-cleaning/" class="hover:text-pink-400 transition-colors">Anna Maria</a>
            <a href="/foxleigh-cleaning/" class="hover:text-pink-400 transition-colors">Foxleigh</a>
            <a href="/palmer-ranch-cleaning/" class="hover:text-pink-400 transition-colors">Palmer Ranch</a>
            <a href="/lakewood-ranch-cleaning/" class="hover:text-pink-400 transition-colors">Lakewood Ranch</a>
            <a href="/osprey-cleaning/" class="hover:text-pink-400 transition-colors">Osprey</a>
            <a href="/university-park-cleaning/" class="hover:text-pink-400 transition-colors">University Park</a>
            <a href="/laurel-cleaning/" class="hover:text-pink-400 transition-colors">Laurel</a>
            <a href="/sarasota-cleaning/" class="hover:text-pink-400 transition-colors">Sarasota</a>
            <a href="/longboat-key-cleaning/" class="hover:text-pink-400 transition-colors">Longboat Key</a>
            <a href="/bradenton-beach-cleaning/" class="hover:text-pink-400 transition-colors">Bradenton Beach</a>
            <a href="/nokomis-cleaning/" class="hover:text-pink-400 transition-colors">Nokomis</a>
            <a href="/siesta-key-cleaning/" class="hover:text-pink-400 transition-colors">Siesta Key</a>
            <a href="/fruitville-cleaning/" class="hover:text-pink-400 transition-colors">Fruitville</a>
            <a href="/holmes-beach-cleaning/" class="hover:text-pink-400 transition-colors">Holmes Beach</a>
            <a href="/whitfield-cleaning/" class="hover:text-pink-400 transition-colors">Whitfield</a>
            <a href="/parrish-cleaning/" class="hover:text-pink-400 transition-colors">Parrish</a>
            <a href="/braden-river-cleaning/" class="hover:text-pink-400 transition-colors">Braden River</a>
            <a href="/bee-ridge-cleaning/" class="hover:text-pink-400 transition-colors">Bee Ridge</a>
            <a href="/bayshore-gardens-cleaning/" class="hover:text-pink-400 transition-colors">Bayshore Gardens</a>
            <a href="/venice-cleaning/" class="hover:text-pink-400 transition-colors">Venice</a>
            <a href="/the-meadows-cleaning/" class="hover:text-pink-400 transition-colors">The Meadows</a>
            <a href="/gulf-gate-estates-cleaning/" class="hover:text-pink-400 transition-colors">Gulf Gate</a>
            <a href="/south-gate-cleaning/" class="hover:text-pink-400 transition-colors">South Gate</a>
            <a href="/ellenton-cleaning/" class="hover:text-pink-400 transition-colors">Ellenton</a>
            <a href="/sarasota-springs-cleaning/" class="hover:text-pink-400 transition-colors">Sarasota Springs</a>
            <a href="/lake-sarasota-cleaning/" class="hover:text-pink-400 transition-colors">Lake Sarasota</a>
            <a href="/south-sarasota-cleaning/" class="hover:text-pink-400 transition-colors">South Sarasota</a>
            <a href="/palmetto-cleaning/" class="hover:text-pink-400 transition-colors">Palmetto</a>
            <a href="/palma-sola-cleaning/" class="hover:text-pink-400 transition-colors">Palma Sola</a>
            <a href="/myakka-cleaning/" class="hover:text-pink-400 transition-colors">Myakka</a>
            <a href="/bird-key-cleaning/" class="hover:text-pink-400 transition-colors">Bird Key</a>
            <a href="/north-port-cleaning/" class="hover:text-pink-400 transition-colors">North Port</a>
            <a href="/south-venice-cleaning/" class="hover:text-pink-400 transition-colors">South Venice</a>
            <a href="/englewood-cleaning/" class="hover:text-pink-400 transition-colors">Englewood</a>
            <a href="/rotonda-west-cleaning/" class="hover:text-pink-400 transition-colors">Rotonda West</a>
            <a href="/port-charlotte-cleaning/" class="hover:text-pink-400 transition-colors">Port Charlotte</a>
            <a href="/ruskin-cleaning/" class="hover:text-pink-400 transition-colors">Ruskin</a>
            <a href="/apollo-beach-cleaning/" class="hover:text-pink-400 transition-colors">Apollo Beach</a>
            <a href="/terra-ceia-cleaning/" class="hover:text-pink-400 transition-colors">Terra Ceia</a>
            <a href="/lido-key-cleaning/" class="hover:text-pink-400 transition-colors">Lido Key</a>
            <a href="/vamo-cleaning/" class="hover:text-pink-400 transition-colors">Vamo</a>
            <a href="/sun-city-center-cleaning/" class="hover:text-pink-400 transition-colors">Sun City Center</a>
            <a href="/arcadia-cleaning/" class="hover:text-pink-400 transition-colors">Arcadia</a>
          </div>
        </div>
      </div>
      <div class="pt-8 border-t border-pink-200 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
        <div>&copy; 2026 Sweet Maid Cleaning Service. Licensed & Insured.</div>
        <div class="flex gap-6">
          <a href="/sitemap.xml" class="hover:text-pink-400">Sitemap</a>
          <a href="/home/" class="hover:text-pink-400 font-bold">Call Now: (941) 222-2080</a>
        </div>
      </div>
    </div>
  </footer>
'@

foreach ($file in $files) {
    if ($file.FullName -match "\\images\\" -or $file.FullName -match "\\.git\\" -or $file.FullName -contains "node_modules") { continue }
    
    $content = Get-Content $file.FullName -Raw
    if ([string]::IsNullOrWhiteSpace($content)) { continue }

    # Replace everything from <footer to </footer>
    $newContent = [regex]::Replace($content, '(?si)<footer.*?>.*?</footer>', $footerHtml)
    
    if ($newContent -ne $content) {
        Write-Host "Standardized Footer in: $($file.Directory.Name)"
        [System.IO.File]::WriteAllText($file.FullName, $newContent, $utf8NoBom)
    }
}

Write-Host "Global Footer Dominance Complete."
