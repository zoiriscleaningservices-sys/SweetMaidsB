$htmlFiles = Get-ChildItem -Path "C:\Users\lucia\OneDrive\Desktop\SweetMaidsB" -Filter "*.html" -Recurse | Where-Object { $_.FullName -notmatch "\\node_modules\\" -and $_.FullName -notmatch "\\\.git\\" }

$report = @()

foreach ($file in $htmlFiles) {
    # Skip dashboard/message stuff maybe? No, let's include them and see.
    $content = Get-Content -Path $file.FullName -Raw

    $issues = @()

    # Canonical tags
    $canonicalCount = ([regex]::Matches($content, '(?i)<link\s+rel=["'']canonical["'']')).Count
    if ($canonicalCount -eq 0) { $issues += "Missing Canonical Tag" }
    if ($canonicalCount -gt 1) { $issues += "Multiple Canonical Tags ($canonicalCount)" }

    # Meta Robots
    $robotsCount = ([regex]::Matches($content, '(?i)<meta\s+name=["'']robots["'']\s+content=["''](.*?)["'']')).Count
    if ($robotsCount -eq 0) {
        # Actually it's okay to omit it, but checking if there's noindex
        $issues += "Missing Meta Robots"
    }
    else {
        $robotsMatches = [regex]::Matches($content, '(?i)<meta\s+name=["'']robots["'']\s+content=["''](.*?)["'']')
        foreach ($m in $robotsMatches) {
            if ($m.Groups[1].Value -match 'noindex|nofollow') {
                $issues += "Contains noindex/nofollow: $($m.Groups[1].Value)"
            }
        }
    }

    # Title Tags
    $titleCount = ([regex]::Matches($content, '(?i)<title>')).Count
    if ($titleCount -eq 0) { $issues += "Missing Title Tag" }
    if ($titleCount -gt 1) { $issues += "Multiple Title Tags ($titleCount)" }

    # Meta Description
    $descCount = ([regex]::Matches($content, '(?i)<meta\s+name=["'']description["'']')).Count
    if ($descCount -eq 0) { $issues += "Missing Meta Description" }
    if ($descCount -gt 1) { $issues += "Multiple Meta Descriptions ($descCount)" }

    # H1 Tags
    $h1Count = ([regex]::Matches($content, '(?i)<h1\b')).Count
    if ($h1Count -eq 0) { $issues += "Missing H1 Tag" }
    if ($h1Count -gt 1) { $issues += "Multiple H1 Tags ($h1Count)" }
    
    # HYPER-LOCAL SEO BLOCK
    $seoBlockCount = ([regex]::Matches($content, '(?i)<!-- HYPER-LOCAL SEO BLOCK -->')).Count
    if ($seoBlockCount -gt 1) { $issues += "Multiple SEO Blocks ($seoBlockCount)" }

    if ($issues.Count -gt 0) {
        $report += [PSCustomObject]@{
            File   = $file.FullName.Replace("C:\Users\lucia\OneDrive\Desktop\SweetMaidsB\", "")
            Issues = ($issues -join "; ")
        }
    }
}

if ($report.Count -eq 0) {
    Write-Host "SEO Audit Passed! No critical issues found." -ForegroundColor Green
}
else {
    Write-Host "SEO Audit Found Issues in $($report.Count) files. Showing top 20:" -ForegroundColor Yellow
    $report | Select-Object -First 20 | Format-Table -AutoSize
    
    # Summarize issues
    Write-Host "`nIssue Summary:"
    $summary = @{}
    foreach ($item in $report) {
        $itemIssues = $item.Issues -split "; "
        foreach ($iss in $itemIssues) {
            $baseIss = $iss -replace " \(\d+\)", ""
            if (-not $summary.ContainsKey($baseIss)) { $summary[$baseIss] = 0 }
            $summary[$baseIss]++
        }
    }
    $summary.GetEnumerator() | Sort-Object Value -Descending | Format-Table -AutoSize
}
