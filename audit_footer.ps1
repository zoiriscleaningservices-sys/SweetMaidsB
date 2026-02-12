$targetUrl = "https://services.leadconnectorhq.com/hooks/RGNEnMA6xLejdcbEGm3v/webhook-trigger/888d6e02-155f-4f9a-9c06-647b61b4cd15"
$rootPath = "c:\Users\lucia\OneDrive\Desktop\SweetMaidsB"

$files = Get-ChildItem -Path $rootPath -Filter "index.html" -Recurse

foreach ($file in $files) {
    if ($file.FullName -like "*\node_modules\*") { continue }
    
    $content = Get-Content $file.FullName -Raw
    
    # Check if file has the footer form script
    # The footer form typically uses #contactForm
    if ($content -match 'const form = section.querySelector\("#contactForm"\)') {
        
        # We need to find the fetch call specifically associated with this form.
        # This script block usually appears near the end, separate from the hero one.
        
        # Strategy: match the specific fetch URL. If it exists in the file, it's LIKELY correct for the footer,
        # because the hero form supposedly uses a DIFFERENT url (which we just verified).
        # So if this distinct footer URL is present, we are good.
        
        if ($content -like "*$targetUrl*") {
            # Write-Host "OK: $($file.Name)" -ForegroundColor Green
        } else {
            Write-Host "MISMATCH: $($file.FullName)" -ForegroundColor Red
        }
    }
}
