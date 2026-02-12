$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
$files = Get-ChildItem -Path $root -Filter "*.html" -Recurse

$newMenuHtml = @"
  <!-- Mobile Menu Expansion -->
  <div id="mobile-menu" class="fixed inset-0 z-[100] mobile-menu-glass flex flex-col invisible">
    <div class="p-6 flex justify-between items-center border-b border-pink-100 bg-white/50">
      <div class="flex items-center gap-2">
        <img src="https://i.ibb.co/PzPDfC1N/Whats-App-Image-2026-02-09-at-4-52-59-PM-Picsart-Background-Remover.png"
          alt="Sweet Maid" class="h-10 w-auto">
        <span class="font-serif text-lg font-bold text-gray-900">Sweet Maid</span>
      </div>
      <button id="close-mobile"
        class="w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition-colors">
        <i class="fa-solid fa-xmark text-xl"></i>
      </button>
    </div>
    <div class="flex-1 overflow-y-auto px-6 py-8">
      <nav class="flex flex-col gap-4">
        <a href="/home/" class="menu-item delay-1 flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all">
          <span class="font-bold text-gray-800">Home</span>
          <i class="fa-solid fa-house text-pink-300"></i>
        </a>
        <a href="/about/" class="menu-item delay-2 flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all">
          <span class="font-bold text-gray-800">About Us</span>
          <i class="fa-solid fa-circle-info text-pink-300"></i>
        </a>
        <div class="menu-item delay-3 accordion-group">
          <button onclick="this.parentElement.classList.toggle('accordion-active')" class="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all">
            <span class="font-bold text-gray-800">Our Services</span>
            <i class="fa-solid fa-chevron-down accordion-icon text-pink-300"></i>
          </button>
          <div class="accordion-content">
            <div class="grid grid-cols-1 gap-2 p-3 mt-1 bg-pink-50/30 rounded-2xl border border-pink-100/50">
              <a href="/house-cleaning/" class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i class="fa-solid fa-broom text-pink-300 w-5"></i> House Cleaning</a>
              <a href="/airbnb-cleaning/" class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i class="fa-solid fa-key text-pink-300 w-5"></i> Airbnb Cleaning</a>
              <a href="/deep-cleaning/" class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i class="fa-solid fa-sparkles text-pink-300 w-5"></i> Deep Cleaning</a>
              <a href="/post-construction-cleaning/" class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i class="fa-solid fa-trowel-bricks text-pink-300 w-5"></i> Post-Construction</a>
              <a href="/commercial-cleaning/" class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i class="fa-solid fa-building text-pink-300 w-5"></i> Commercial Cleaning</a>
              <a href="/move-in-out-cleaning/" class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i class="fa-solid fa-truck-ramp-box text-pink-300 w-5"></i> Move In/Out</a>
              <a href="/pressure-washing/" class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i class="fa-solid fa-water text-pink-300 w-5"></i> Pressure Washing</a>
              <a href="/carpet-cleaning/" class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i class="fa-solid fa-rug text-pink-300 w-5"></i> Carpet Cleaning</a>
              <a href="/window-cleaning/" class="mobile-link flex items-center gap-3 p-3 rounded-xl hover:bg-white text-gray-700 font-medium transition-all"><i class="fa-solid fa-window-maximize text-pink-300 w-5"></i> Window Cleaning</a>
            </div>
          </div>
        </div>
        <div class="menu-item delay-4 accordion-group">
          <button onclick="this.parentElement.classList.toggle('accordion-active')" class="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all">
            <span class="font-bold text-gray-800">Locations We Serve</span>
            <i class="fa-solid fa-chevron-down accordion-icon text-pink-300"></i>
          </button>
          <div class="accordion-content">
            <div class="grid grid-cols-2 gap-x-4 gap-y-1 p-4 mt-1 bg-pink-50/30 rounded-2xl border border-pink-100/50">
              <a href="/anna-maria-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Anna Maria</a>
              <a href="/bayshore-gardens-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Bayshore Gardens</a>
              <a href="/bee-ridge-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Bee Ridge</a>
              <a href="/bird-key-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Bird Key</a>
              <a href="/braden-river-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Braden River</a>
              <a href="/bradenton-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Bradenton</a>
              <a href="/bradenton-beach-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Bradenton Beach</a>
              <a href="/ellenton-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Ellenton</a>
              <a href="/foxleigh-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Foxleigh</a>
              <a href="/fruitville-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Fruitville</a>
              <a href="/gulf-gate-estates-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Gulf Gate Estates</a>
              <a href="/holmes-beach-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Holmes Beach</a>
              <a href="/lake-sarasota-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Lake Sarasota</a>
              <a href="/lakewood-ranch-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Lakewood Ranch</a>
              <a href="/laurel-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Laurel</a>
              <a href="/longboat-key-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Longboat Key</a>
              <a href="/myakka-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Myakka</a>
              <a href="/nokomis-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Nokomis</a>
              <a href="/osprey-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Osprey</a>
              <a href="/palma-sola-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Palma Sola</a>
              <a href="/palmer-ranch-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Palmer Ranch</a>
              <a href="/palmetto-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Palmetto</a>
              <a href="/parrish-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Parrish</a>
              <a href="/sarasota-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Sarasota</a>
              <a href="/sarasota-springs-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Sarasota Springs</a>
              <a href="/siesta-key-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Siesta Key</a>
              <a href="/south-gate-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">South Gate</a>
              <a href="/south-sarasota-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">South Sarasota</a>
              <a href="/the-meadows-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">The Meadows</a>
              <a href="/university-park-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">University Park</a>
              <a href="/venice-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Venice</a>
              <a href="/whitfield-cleaning/" class="mobile-link py-2 text-sm text-gray-600 hover:text-pink-400">Whitfield</a>
            </div>
          </div>
        </div>
        <a href="/blog/" class="menu-item delay-5 flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all">
          <span class="font-bold text-gray-800">Blogs</span>
          <i class="fa-solid fa-newspaper text-pink-300"></i>
        </a>
        <a href="/gallery/" class="menu-item delay-6 flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all">
          <span class="font-bold text-gray-800">Gallery</span>
          <i class="fa-solid fa-camera text-pink-300"></i>
        </a>
        <div class="menu-item delay-7 mt-4 flex flex-col gap-4">
          <a href="#quote" class="w-full bg-gradient-to-r from-pink-300 to-pink-300 text-gray-800 text-center rounded-2xl py-4 font-bold shadow-lg shadow-pink-200 hover:shadow-xl transition-all">Get Your Free Quote</a>
          <a href="tel:16452176738" class="w-full bg-white text-pink-400 border-2 border-pink-100 text-center rounded-2xl py-4 font-bold hover:bg-pink-50 transition-all"><i class="fa-solid fa-phone mr-2"></i> (645) 217-6738</a>
        </div>
      </nav>
      <div class="menu-item delay-7 mt-12 pt-8 border-t border-pink-100 flex flex-col items-center gap-4 text-center">
        <p class="text-sm text-gray-500 font-medium">Follow us for cleaning tips!</p>
        <div class="flex gap-4">
          <a href="#" class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-400 hover:bg-pink-300 hover:text-white transition-all"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#" class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-400 hover:bg-pink-300 hover:text-white transition-all"><i class="fa-brands fa-instagram"></i></a>
          <a href="#" class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-400 hover:bg-pink-300 hover:text-white transition-all"><i class="fa-brands fa-tiktok"></i></a>
        </div>
      </div>
    </div>
  </div>
"@

$oldMenuPattern = '(?s)<!-- Mobile Menu Expansion -->\s*<div id="mobile-menu".*?</div>\s*</div>'

foreach ($file in $files) {
    if ($file.Name -eq "index.html" -and $file.DirectoryName -match "SweetMaidsB$") { continue }
    
    $content = Get-Content $file.FullName -Raw
    $changed = $false

    # Update HTML
    if ($content -match $oldMenuPattern) {
        $content = [regex]::Replace($content, $oldMenuPattern, $newMenuHtml)
        $changed = $true
    }

    if ($changed) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "Updated mobile locations in $($file.FullName)"
    }
}

Write-Host "Global location update complete."
