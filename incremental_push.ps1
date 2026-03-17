$commits = $(git log origin/main..main --reverse --format=%H)

if ($commits.Length -eq 0) {
    Write-Host "No commits to push."
    exit 0
}

Write-Host "Found $($commits.Length) commits to push incrementally."

# Force push the first commit to overwrite remote entirely and fix divergence
$first_commit = $commits[0]
Write-Host "Force pushing first commit $first_commit to reset remote branch..."
git push -f origin "$($first_commit):refs/heads/main"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to force push first commit. Aborting."
    exit 1
}

# Push sequentially in chunks to avoid mmap memory allocation failures
for ($i = 9; $i -lt $commits.Length; $i += 10) {
    $commit = $commits[$i]
    Write-Host "Incremental push to $commit (Commit index: $i)..."
    git push origin "$($commit):refs/heads/main"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to push at commit $commit. Aborting."
        exit 1
    }
}

# Push whatever is remaining securely to the head of main
Write-Host "Pushing the final remaining commits to main..."
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to push final commits."
    exit 1
}

Write-Host "Incremental push completed successfully!"
