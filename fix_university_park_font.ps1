$root = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"
$files = Get-ChildItem -Path $root -Filter "*.html" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Target: text-sm transition">University Park
    # Replace with: text-xs transition">University Park
    # We use regex to be safe about spacing, though exact string likely works.
    
    # 1. Match links with "University Park" that utilize text-sm
    # We look for 'text-sm' followed by optional chars and then 'University Park'
    # But we want to be careful not to change other text-sm instances.
    # The pattern in index.html is: ... font-medium text-sm transition">University Park...
    
    # Let's replace specifically the sequence related to this menu item.
    $content = $content -replace "text-sm transition"">University Park", "text-xs transition"">University Park"
    
    # Also try with single quotes just in case
    $content = $content -replace "text-sm transition'>University Park", "text-xs transition'>University Park"
    
    if ($content -ne $originalContent) {
        Write-Host "Fixed font size in $($file.Name)"
        Set-Content -Path $file.FullName -Value $content
        
        # Verify
        if ($file.Name -eq "index.html" -and $file.Directory.Name -eq "home") {
             Write-Host "Verification for home/index.html:"
             $lines = $content -split "`n"
             $lines | Select-String "University Park" -Context 0,1 | Out-String | Write-Host
        }
    }
}

Write-Host "University Park font fix complete."
