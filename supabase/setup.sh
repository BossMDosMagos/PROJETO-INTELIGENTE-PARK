#!/bin/bash

# ==========================================
# SETUP RÁPIDO SUPABASE CLI
# ==========================================
# Use: bash supabase/setup.sh
# Ou no Windows PowerShell:
# powershell -ExecutionPolicy Bypass -File supabase/setup.ps1

echo "🚀 Inicializando Supabase CLI..."
echo ""

# 1. Verificar se CLI está instalada
echo "✅ Verificando Supabase CLI..."
npx supabase --version
echo ""

# 2. Login
echo "🔑 Fazendo login no Supabase..."
echo "Será aberta janela do navegador para autenticação"
echo ""
read -p "Pressione ENTER para continuar com login..."
npx supabase login
echo ""

# 3. Listar projetos
echo "📋 Listando seus projetos Supabase..."
npx supabase projects list
echo ""

# 4. Vincular projeto
echo "🔗 Vincule seu projeto:"
read -p "Copie o Project ID acima e cole aqui (ex: abc123def456): " PROJECT_ID

# Salvar em supabase.json
npx supabase link --project-ref "$PROJECT_ID"
echo ""

# 5. Verificar status
echo "📊 Status da conexão:"
npx supabase status
echo ""

# 6. Aplicar migrações
echo "📦 Aplicando schema incial..."
npx supabase migration up
echo ""

# 7. Verificar migrações
echo "✅ Migrações aplicadas:"
npx supabase migration list
echo ""

echo "🎉 Setup completo!"
echo ""
echo "Próximos passos:"
echo "  1. npm run db:start          - Iniciar Supabase local"
echo "  2. npm run dev              - Iniciar app"
echo "  3. Criar usuário MASTER em Auth"
echo "  4. Acessar http://localhost:54323 para Studio"
echo ""
echo "Ler mais em: docs/SUPABASE_CLI_SETUP.md"
