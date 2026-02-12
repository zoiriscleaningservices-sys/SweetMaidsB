$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
$files = Get-ChildItem -Path $root -Filter "*.html" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Replace src=\" with src="
    $content = $content.Replace("src=\`"", "src=`"")
    
    # Replace href=\" with href="
    $content = $content.Replace("href=\`"", "href=`"")
    
    # Also check single quotes just in case: src=\' -> src='
    $content = $content.Replace("src=\'", "src='")
    $content = $content.Replace("href=\'", "href='")

    if ($content -ne $originalContent) {
        Write-Host "Fixed attributes in $($file.Name)"
        Set-Content -Path $file.FullName -Value $content
        
        # Verify fix for one file
        if ($file.Name -eq "index.html" -and $file.Directory.Name -eq "home") {
             Write-Host "Verification for home/index.html:"
             $lines = $content -split "`n"
             $lines | Select-String "Sparkling Clean Bathroom" -Context 0,2 | Out-String | Write-Host
        }
    }
}

Write-Host "Attribute fix complete."
