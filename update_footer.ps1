$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
$files = Get-ChildItem -Path $root -Filter "*.html" -Recurse

# The HTML for the new social media section
# We use flex-wrap to ensure it handles 9 icons gracefully on smaller screens
$newSocialHtml = @"
          <!-- Social Media with Hover Effects -->
          <div class="flex flex-wrap gap-3">
            <!-- Facebook -->
            <a href="https://www.facebook.com/SweetMaidCleaningService/" target="_blank"
              class="group relative w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-pink-300 hover:border-pink-200 transition-all duration-300 overflow-hidden">
              <i class="fab fa-facebook-f text-gray-800 relative z-10"></i>
              <div class="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <!-- Instagram -->
            <a href="https://www.instagram.com/sweetmaidcleaningservice/" target="_blank"
              class="group relative w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-pink-300 hover:border-pink-200 transition-all duration-300 overflow-hidden">
              <i class="fab fa-instagram text-gray-800 relative z-10"></i>
              <div class="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <!-- Google / Review -->
            <a href="https://g.page/r/CcF-dDstjsBwEAE/review" target="_blank" title="Leave us a Review"
              class="group relative w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-pink-300 hover:border-pink-200 transition-all duration-300 overflow-hidden">
              <i class="fab fa-google text-gray-800 relative z-10"></i>
              <div class="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <!-- Yelp -->
            <a href="https://www.yelp.com/biz/sweet-maid-cleaning-service-bradenton-2" target="_blank"
              class="group relative w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-pink-300 hover:border-pink-200 transition-all duration-300 overflow-hidden">
              <i class="fab fa-yelp text-gray-800 relative z-10"></i>
              <div class="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <!-- Twitter / X -->
            <a href="https://x.com/sweetmaidclean" target="_blank"
              class="group relative w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-pink-300 hover:border-pink-200 transition-all duration-300 overflow-hidden">
              <i class="fab fa-x-twitter text-gray-800 relative z-10"></i>
              <div class="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <!-- YouTube -->
            <a href="https://www.youtube.com/@sweetmaidcleaning" target="_blank"
              class="group relative w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-pink-300 hover:border-pink-200 transition-all duration-300 overflow-hidden">
              <i class="fab fa-youtube text-gray-800 relative z-10"></i>
              <div class="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <!-- LinkedIn -->
            <a href="https://www.linkedin.com/in/sweet-maid-cleaning-service-5b625435a/" target="_blank"
              class="group relative w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-pink-300 hover:border-pink-200 transition-all duration-300 overflow-hidden">
              <i class="fab fa-linkedin-in text-gray-800 relative z-10"></i>
              <div class="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <!-- Pinterest -->
            <a href="https://www.pinterest.com/sweetmaidcleaning/" target="_blank"
              class="group relative w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-pink-300 hover:border-pink-200 transition-all duration-300 overflow-hidden">
              <i class="fab fa-pinterest-p text-gray-800 relative z-10"></i>
              <div class="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <!-- TikTok -->
            <a href="https://www.tiktok.com/@sweetmaidcleaningservice" target="_blank"
              class="group relative w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-pink-300 hover:border-pink-200 transition-all duration-300 overflow-hidden">
              <i class="fab fa-tiktok text-gray-800 relative z-10"></i>
              <div class="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
          </div>
"@

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # We create a regex to match the existing block
    # It starts with <!-- Social Media with Hover Effects -->
    # And ends with the closing div of that block.
    # The block structure in key files is:
    # <!-- Social Media with Hover Effects -->
    # <div class="flex gap-3">
    #   ... (links) ...
    # </div>
    
    # Simple regex to capture this block
    # We match from the comment until the specific closing div pattern or just broadly.
    # Given the indentation, it's safer to use the comment as the anchor.
    
    if ($content -match '<!-- Social Media with Hover Effects -->') {
        # regex to replace until the closing div of the flex container
        # The container starts with <div class="flex gap-3">
        # We need to match everything from the comment down to the closing </div> of that specific container.
        
        # We'll use a slightly broader match but be careful.
        # Pattern: Comment + whitespace + <div class="flex gap-3"> ... </div>
        # We will match non-greedy until </div> and maybe a few </div>s if nested? 
        # Actually the inner links have </div> for the gradient overlay.
        # So counting divs is hard with regex.
        
        # Alternative: We know the exact structure of the OLD block from our view_file.
        # It has 4 links.
        
        $pattern = '(?s)<!-- Social Media with Hover Effects -->.*?<div class="flex gap-3">.*?</a>\s*</div>'
        
        if ($content -match $pattern) {
             $content = $content -replace $pattern, $newSocialHtml
             Set-Content -Path $file.FullName -Value $content
             Write-Host "Updated footer in $($file.Name)"
        } else {
             Write-Host "Pattern not matched in $($file.Name)"
        }
    }
}

Write-Host "Footer update complete."
