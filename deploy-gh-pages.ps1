# Deploy para GitHub Pages (branch gh-pages)
# Uso: .\deploy-gh-pages.ps1

Write-Host "🚀 Iniciando deploy para GitHub Pages..." -ForegroundColor Cyan

# Encontrar Git (GitHub Desktop ou instalação padrão)
$gitPath = $null
$gitPaths = @(
    "C:\Program Files\Git\cmd\git.exe",
    "C:\Program Files (x86)\Git\cmd\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe"
)

foreach ($path in $gitPaths) {
    if (Test-Path $path) {
        $gitPath = $path
        break
    }
}

if (-not $gitPath) {
    $ghPath = Get-Item "$env:LOCALAPPDATA\GitHubDesktop\app-*\resources\app\git\cmd\git.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($ghPath) {
        $gitPath = $ghPath.FullName
    }
}

if (-not $gitPath) {
    Write-Host "❌ Git não encontrado. Instale o Git ou GitHub Desktop." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Git encontrado: $gitPath" -ForegroundColor Green

# Configurar alias para git
function git { & $gitPath @args }

# Verificar se há mudanças não commitadas
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️  Você tem mudanças não commitadas. Deseja continuar? (S/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne 'S' -and $response -ne 's') {
        Write-Host "❌ Deploy cancelado." -ForegroundColor Red
        exit 1
    }
}

# Verificar se a pasta dist existe
if (-not (Test-Path "dist")) {
    Write-Host "❌ Pasta dist/ não encontrada. Execute 'npm run build' primeiro." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Preparando arquivos de build..." -ForegroundColor Cyan

# Salvar branch atual
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "📍 Branch atual: $currentBranch" -ForegroundColor Gray

# Criar/atualizar branch gh-pages
$ghPagesBranchExists = git show-ref --verify --quiet refs/heads/gh-pages
if ($LASTEXITCODE -eq 0) {
    Write-Host "🔄 Branch gh-pages existe, atualizando..." -ForegroundColor Cyan
    git checkout gh-pages
} else {
    Write-Host "🆕 Criando branch gh-pages..." -ForegroundColor Cyan
    git checkout --orphan gh-pages
    git rm -rf .
}

# Copiar arquivos de dist/ para a raiz
Write-Host "📋 Copiando arquivos de dist/..." -ForegroundColor Cyan
Get-ChildItem -Path "dist\*" -Recurse | ForEach-Object {
    $destination = $_.FullName -replace [regex]::Escape((Get-Location).Path + "\dist\"), ""
    if ($_.PSIsContainer) {
        New-Item -ItemType Directory -Path $destination -Force | Out-Null
    } else {
        Copy-Item -Path $_.FullName -Destination $destination -Force
    }
}

# Criar .nojekyll se não existir
if (-not (Test-Path ".nojekyll")) {
    New-Item -ItemType File -Path ".nojekyll" -Force | Out-Null
    Write-Host "✅ Arquivo .nojekyll criado" -ForegroundColor Green
}

# Add, commit e push
Write-Host "📤 Commitando mudanças..." -ForegroundColor Cyan
git add -A
git commit -m "Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

Write-Host "🚀 Enviando para GitHub..." -ForegroundColor Cyan
git push origin gh-pages --force

# Voltar para o branch original
Write-Host "🔙 Retornando para branch $currentBranch..." -ForegroundColor Cyan
git checkout $currentBranch

Write-Host ""
Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Abra: https://github.com/SEU-USUARIO/SEU-REPO/settings/pages" -ForegroundColor White
Write-Host "   2. Em 'Source', selecione: Branch 'gh-pages' / folder '/ (root)'" -ForegroundColor White
Write-Host "   3. Aguarde 1-2 minutos para o deploy" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Seu site estará em: https://SEU-USUARIO.github.io/SEU-REPO/" -ForegroundColor Cyan
