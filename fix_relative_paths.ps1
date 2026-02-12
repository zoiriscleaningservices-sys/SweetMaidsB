$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"

# We know all HTML files are in subdirectories (depth 1), except root index.html which is a redirect.
# So effectively every content file needs `../` prefix for assets in root folders (images, css, js).

$folders = @("images", "css", "js")
$files = Get-ChildItem -Path $root -Filter "*.html" -Recurse

foreach ($file in $files) {
    # Skip root index.html
    if ($file.FullName -eq "$root\index.html") { continue }
    
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    foreach ($folder in $folders) {
        # Regex to match: quote + optional whitespace + foldername + slash
        # e.g. "images/, 'images/, "  images/
        # Negative lookbehind to ensure we don't match if it's already ../ or /
        # Actually easier: match (quote)($folder/) and replace with $1../$2
        
        # Pattern:
        # (['"]) -> Group 1: Quote
        # ($folder/) -> Group 2: folder/
        # AND we want to ensure it's NOT preceded by . or / inside the quote?
        # That's hard with just (['"]).
        
        # Let's match strict start of string in quote.
        # (?<=['"])$folder/
        
        $pattern = "(?<=['`"])$folder/"  # Added backtick just in case of template literals
        
        if ($content -match $pattern) {
             # Write-Host "  Fixing $folder references in $($file.Name)"
             $content = $content -replace $pattern, "../$folder/"
        }
    }
    
    if ($content -ne $originalContent) {
        Write-Host "Fixed relative paths in $($file.Name)"
        Set-Content -Path $file.FullName -Value $content
    }
}

Write-Host "Relative path fix complete."
