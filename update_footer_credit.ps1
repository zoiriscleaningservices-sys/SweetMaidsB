$files = Get-ChildItem -Filter *.html -Recurse

# Define the pattern to find (multiline, flexible whitespace)
# We are looking for the div containing the heart icon and "Made with love..."
# <div class="flex items-center gap-2 text-gray-400 text-sm">\s*<i class="fa-solid fa-heart text-pink-300 animate-pulse"></i>\s*Made with love in Bradenton, FL\s*</div>

$pattern = '(?s)<div class="flex items-center gap-2 text-gray-400 text-sm">\s*<i class="fa-solid fa-heart text-pink-300 animate-pulse"></i>\s*Made with love in .*?\s*</div>'

# New content
# Note: Using text-yellow-500 for gold.
$newContent = '<div class="flex items-center gap-2 text-gray-400 text-sm">
            Made by <a href="https://truewebx.site/" target="_blank" class="text-yellow-500 hover:text-yellow-400 font-bold flex items-center gap-1 transition-colors">TrueWebX <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i></a>
          </div>'

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    
    if ($content -match $pattern) {
        Write-Host "Updating $($file.Name)..."
        $newFileContent = $content -replace $pattern, $newContent
        [System.IO.File]::WriteAllText($file.FullName, $newFileContent, [System.Text.Encoding]::UTF8)
    } else {
        Write-Host "Skipping $($file.Name) - Pattern not found."
    }
}
