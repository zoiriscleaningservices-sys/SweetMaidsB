$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
$files = Get-ChildItem -Path $root -Filter "*.html" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Fix 1: Replace bg-white/98 with bg-white (solid)
    if ($content -match 'bg-white/98') {
        $content = $content -replace 'bg-white/98', 'bg-white'
        Write-Host "Fixed background opacity in $($file.Name)"
    }
    
    # Fix 2: Increase z-index of mobile menu to 100 to ensure it's above header
    # The line is: <div id="mobile-menu" class="fixed inset-0 bg-white/98 z-50 hidden flex flex-col overflow-y-auto">
    # We want to change z-50 to z-[60] or z-[100] WITHIN that specific div
    
    # We can use regex to target the ID and the class string
    $content = $content -replace 'id="mobile-menu" class="([^"]*)z-50([^"]*)"', 'id="mobile-menu" class="$1z-[100]$2"'
    
    # Just in case the z-50 is at the end or beginning differently, let's be more specific or robust
    if ($content -match 'id="mobile-menu".*z-50') {
         # split the content by the mobile menu tag to operate potentially locally? 
         # Or just simplistic replace if unique enough.
         # The string `fixed inset-0 bg-white z-50` (after prev replace) is fairly unique to the menu
         $content = $content -replace 'fixed inset-0 bg-white z-50', 'fixed inset-0 bg-white z-[100]'
    }

    Set-Content -Path $file.FullName -Value $content
}

Write-Host "Mobile Menu Fixes Complete"
