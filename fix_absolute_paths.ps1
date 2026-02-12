$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"

# Helper to get relative path to root from a file
function Get-RelativePathToRoot ($filePath) {
    $relPath = $filePath.Substring($root.Length)
    # Count how many backslashes (folder depth)
    # File in root (e.g. \index.html) has depth 1 (the leading slash) -> needs ./
    # File in sub (e.g. \home\index.html) has depth 2 -> needs ../
    
    # We normalized path so it starts with \
    $depth = ($relPath.ToCharArray() | Where-Object { $_ -eq '\' }).Count
    
    # Root files are depth 1 (e.g. \index.html) -> return "." or "./"
    if ($depth -le 1) { return "." }
    
    # Subdir files are depth 2 (e.g. \home\index.html) -> return ".."
    # Sub-subdir files are depth 3 -> return "../.."
    
    $ups = @()
    for ($i = 0; $i -lt ($depth - 1); $i++) {
        $ups += ".."
    }
    return $ups -join "/"
}

$files = Get-ChildItem -Path $root -Filter "*.html" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    $param_relRoot = Get-RelativePathToRoot $file.FullName
    $relRoot = $param_relRoot # variable variable fix
    if ($relRoot -eq ".") { $relRoot = "" } else { $relRoot = "$relRoot/" }
    
    # Check if we have root absolute paths
    # Matches: src="/images/...", href="/css/...", src="/js/..."
    # We want to replace start of string "/images/" with "$relRoot/images/"
    # BUT we must be careful not to replace "http://..." but our regex /images/ handles that.
    
    # defined explicit replacements for known assets folders
    $folders = @("images", "css", "js")
    
    foreach ($folder in $folders) {
        # Pattern: quote + / + folder name + /
        # e.g. "/images/
        # We replace with " + relRoot + folder + /
        # e.g. "../images/
        
        $pattern = "\""/$folder/"
        $replacement = "\""$relRoot$folder/"
        
        if ($content -match $pattern) {
             # Write-Host "  Fixing $folder in $($file.Name) (Root: $relRoot)"
             $content = $content -replace $pattern, $replacement
        }
        
        # Also single quotes
        $patternSq = "'/$folder/"
        $replacementSq = "'$relRoot$folder/"
        if ($content -match $patternSq) {
             $content = $content -replace $patternSq, $replacementSq
        }
        
        # Also in CSS url('/images/...')
        $patternUrl = "url\('/$folder/"
        $replacementUrl = "url('$relRoot$folder/"
        if ($content -match $patternUrl) {
             $content = $content -replace $patternUrl, $replacementUrl
        }
    }
    
    # Also fix internal links like href="/about/" -> href="../about/"
    # This is trickier because we have many pages.
    # But consistent structure: /page-name/ -> ../page-name/
    # Let's fix specific common links if they start with /
    
    # Actually, for navigation links, if I change /about/ to ../about/, it works.
    # Let's try to be generic. href="/.../"
    # Match href="/(something)/"
    
    # But first, let's stick to the REQUESTED fix: Hero Images (assets).
    # The user complained about photos.
    # I should also fix CSS/JS execution.
    
    if ($content -ne $originalContent) {
        Write-Host "Fixed paths in $($file.Name)"
        Set-Content -Path $file.FullName -Value $content
    }
}

Write-Host "Path fix complete."
