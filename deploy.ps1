# Deploy para GitHub Pages
Write-Host "Deploying..." -ForegroundColor Cyan

& "C:\Program Files\Git\cmd\git.exe" checkout gh-pages 2>$null
if (!$?) {
    & "C:\Program Files\Git\cmd\git.exe" checkout --orphan gh-pages
}

Copy-Item -Path "dist\*" -Destination "." -Recurse -Force
"" | Out-File ".nojekyll" -Force

& "C:\Program Files\Git\cmd\git.exe" add -A
& "C:\Program Files\Git\cmd\git.exe" commit -m "Deploy" 2>$null
& "C:\Program Files\Git\cmd\git.exe" push origin gh-pages --force

Write-Host "Done!" -ForegroundColor Green
