$targetUrl = "https://services.leadconnectorhq.com/hooks/RGNEnMA6xLejdcbEGm3v/webhook-trigger/acaff8c7-b7ea-47e8-90d5-adfe581d1517"
$rootPath = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"

$files = Get-ChildItem -Path $rootPath -Filter "index.html" -Recurse

foreach ($file in $files) {
    if ($file.FullName -like "*\node_modules\*") { continue }
    
    $content = Get-Content $file.FullName -Raw
    
    # Check if file has the hero form script
    if ($content -match 'const heroForm = document.getElementById\("heroContactForm"\)') {
        
        # We need to find the fetch call specifically associated with heroForm.
        # The heroForm logic is usually at the end of the file.
        # Let's split the content by the heroForm declaration to isolate that block.
        $parts = $content -split 'const heroForm = document.getElementById\("heroContactForm"\)'
        
        if ($parts.Count -gt 1) {
            $heroScriptBlock = $parts[1]
            
            if ($heroScriptBlock -like "*$targetUrl*") {
                # Write-Host "OK: $($file.Name)" -ForegroundColor Green
            } else {
                Write-Host "MISMATCH: $($file.FullName)" -ForegroundColor Red
            }
        }
    }
}
