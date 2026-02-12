$files = Get-ChildItem -Filter *.html

foreach ($file in $files) {
    Write-Host "Fixing navigation in $($file.Name)..."
    $content = Get-Content $file.FullName -Raw
    
    # 1. Fix Home Link
    $content = $content -replace 'href="#home"', 'href="index.html"'
    
    # 2. Fix About Link
    $content = $content -replace 'href="#about"', 'href="about.html"'
    
    # 3. Fix Logo Link
    # Regex to target the specific logo anchor class if possible, or just exact string match
    $content = $content -replace '(?i)<a href="#" class="flex items-center group">', '<a href="index.html" class="flex items-center group">'
    
    # 4. Fix Contact/Quote Link
    # If the page has the detailed quote form (id="quote"), link to #quote
    # Otherwise, link to index.html#quote
    if ($content -match 'id="quote"') {
        $content = $content -replace 'href="#contact"', 'href="#quote"'
         # Ensure existing #quote links stay #quote (no change needed usually)
    } else {
        $content = $content -replace 'href="#contact"', 'href="index.html#quote"'
        # If there were any #quote links already and no section, point them to index
        $content = $content -replace 'href="#quote"', 'href="index.html#quote"' 
    }

    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
}

Write-Host "Global Navigation Fix Complete!"
