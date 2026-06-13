$frontendOut = "C:\Users\PC\Desktop\workflow\VectoriaRentCar\frontend\out"
$laravelPublic = "C:\Users\PC\Desktop\workflow\VectoriaRentCar\backend\public"

Write-Host "🧹 Cleaning Laravel public folder (keeping storage/)..." -ForegroundColor Yellow
Get-ChildItem -LiteralPath $laravelPublic -Exclude "storage" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "📦 Copying Next.js static export to Laravel public/..." -ForegroundColor Green
Copy-Item -LiteralPath "$frontendOut\*" -Destination $laravelPublic -Recurse -Force

Write-Host "✅ Done! Frontend static export copied to Laravel." -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Next steps on LWS:" -ForegroundColor Cyan
Write-Host "  1. Ensure .env is configured for production"
Write-Host "  2. Run: php artisan route:cache"
Write-Host "  3. Run: php artisan config:cache"
Write-Host "  4. Ensure the SPA fallback route is active in routes/web.php"
Write-Host "  5. Set web root to: public/"
