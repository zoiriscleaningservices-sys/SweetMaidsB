$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
$files = Get-ChildItem -Path $root -Filter "*.html" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Regex to match >University followed by whitespace/newlines followed by Park followed by <
    # (?s) enables dot-matches-newline mode, but we don't need dot, just \s+
    
    $content = $content -replace ">University\s+Park<", ">University Park, FL<"
    
    if ($content -ne $originalContent) {
        Write-Host "Fixed University Park menu link in $($file.Name)"
        Set-Content -Path $file.FullName -Value $content
    }
}

Write-Host "University Park menu fix complete."
