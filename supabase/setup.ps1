# ==========================================
# SETUP RÁPIDO SUPABASE CLI - WINDOWS
# ==========================================
# Use: powershell -ExecutionPolicy Bypass -File supabase/setup.ps1

Write-Host "🚀 Inicializando Supabase CLI..." -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se CLI está instalada
Write-Host "✅ Verificando Supabase CLI..." -ForegroundColor Green
npx supabase --version
Write-Host ""

# 2. Login
Write-Host "🔑 Fazendo login no Supabase..." -ForegroundColor Cyan
Write-Host "Será aberta janela do navegador para autenticação" -ForegroundColor Yellow
Write-Host ""
Read-Host "Pressione ENTER para continuar com login"
npx supabase login
Write-Host ""

# 3. Listar projetos
Write-Host "📋 Listando seus projetos Supabase..." -ForegroundColor Cyan
npx supabase projects list
Write-Host ""

# 4. Vincular projeto
Write-Host "🔗 Vincule seu projeto:" -ForegroundColor Cyan
$projectId = Read-Host "Copie o Project ID acima e cole aqui (ex: abc123def456)"

Write-Host "Conectando ao projeto..." -ForegroundColor Yellow
npx supabase link --project-ref "$projectId"
Write-Host ""

# 5. Verificar status
Write-Host "📊 Status da conexão:" -ForegroundColor Cyan
npx supabase status
Write-Host ""

# 6. Aplicar migrações
Write-Host "📦 Aplicando schema incial..." -ForegroundColor Cyan
npx supabase migration up
Write-Host ""

# 7. Verificar migrações
Write-Host "✅ Migrações aplicadas:" -ForegroundColor Green
npx supabase migration list
Write-Host ""

Write-Host "🎉 Setup completo!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. npm run db:start          - Iniciar Supabase local"
Write-Host "  2. npm run dev              - Iniciar app"
Write-Host "  3. Criar usuário MASTER em Auth"
Write-Host "  4. Acessar http://localhost:54323 para Studio"
Write-Host ""
Write-Host "Ler mais em: docs/SUPABASE_CLI_SETUP.md" -ForegroundColor Yellow
