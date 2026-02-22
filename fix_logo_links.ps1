$ErrorActionPreference = "Stop"

$rootPath = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"

# Find all nested index.html files (excluding the root index.html itself initially, to update later)
$files = Get-ChildItem -Path $rootPath -Recurse -Filter "index.html" | Where-Object {
    $_.DirectoryName -notlike "*\.git*" -and $_.FullName -ne "$rootPath\index.html"
}

$oldLogoLink1 = '<a href="/home/" class="flex items-center group">'
$newLogoLink1 = '<a href="#" onclick="window.scrollTo({top: 0, behavior: ''smooth''}); return false;" class="flex items-center group">'

$oldHomeDesktop = '<a href="/home/" class="text-sm font-semibold text-gray-700 hover:text-pink-300 transition-colors">Home</a>'
$newHomeDesktop = '<a href="#" onclick="window.scrollTo({top: 0, behavior: ''smooth''}); return false;" class="text-sm font-semibold text-gray-700 hover:text-pink-300 transition-colors">Home</a>'

$oldHomeMobile = '<a href="/home/"
          class="menu-item delay-1 flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all">'
$newHomeMobile = '<a href="#" onclick="window.scrollTo({top: 0, behavior: ''smooth''}); return false;"
          class="menu-item delay-1 flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all">'
          
$oldHomeMobileCRLF = "<a href=`"/home/`"`r`n          class=`"menu-item delay-1 flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all`">"
$newHomeMobileCRLF = "<a href=`"#`" onclick=`"window.scrollTo({top: 0, behavior: 'smooth'}); return false;`"`r`n          class=`"menu-item delay-1 flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all`">"

$oldHomeMobileLF = "<a href=`"/home/`"`n          class=`"menu-item delay-1 flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all`">"
$newHomeMobileLF = "<a href=`"#`" onclick=`"window.scrollTo({top: 0, behavior: 'smooth'}); return false;`"`n          class=`"menu-item delay-1 flex items-center justify-between p-4 rounded-2xl bg-white border border-pink-50 shadow-sm hover:border-pink-200 transition-all`">"

$count = 0

foreach ($file in $files) {
    if ($file.DirectoryName -match "\\home$" -or $file.DirectoryName -match "\\home\\") {
        # Keep /home linking to /home/ so it doesn't break itself, but optionally it could scroll. Let's update it to scroll to top anyway since it's the home page.
    }
    
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $modified = $false

    if ($content.Contains($oldLogoLink1)) {
        $content = $content.Replace($oldLogoLink1, $newLogoLink1)
        $modified = $true
    }
    if ($content.Contains($oldHomeDesktop)) {
        $content = $content.Replace($oldHomeDesktop, $newHomeDesktop)
        $modified = $true
    }
    if ($content.Contains($oldHomeMobileCRLF)) {
        $content = $content.Replace($oldHomeMobileCRLF, $newHomeMobileCRLF)
        $modified = $true
    } elseif ($content.Contains($oldHomeMobileLF)) {
        $content = $content.Replace($oldHomeMobileLF, $newHomeMobileLF)
        $modified = $true
    }
    
    # Let's also do a fallback regexp for logo just in case formatting differs:
    $content = $content -replace '(?s)<a href="/home/"[^>]*class="flex items-center group">', '<a href="#" onclick="window.scrollTo({top: 0, behavior: ''smooth''}); return false;" class="flex items-center group">'
    
    if ($modified) {
        [System.IO.File]::WriteAllText($file.FullName, $content, (New-Object System.Text.UTF8Encoding $false))
        $count++
    }
}

Write-Host "Replaced logo/home links in $count files."
