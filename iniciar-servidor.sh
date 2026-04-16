#!/bin/bash

# Iniciar Servidor HTTP para Inteligente Park
# Este arquivo usa o server.js para servir a aplicação

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se dist/ existe
if [ ! -d "dist" ]; then
    echo ""
    echo -e "${RED}❌ ERRO: Pasta 'dist/' não encontrada!${NC}"
    echo ""
    echo "Você precisa compilar o projeto primeiro:"
    echo "  npm run build"
    echo ""
    echo "Depois rode novamente este arquivo."
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo ""
    echo -e "${RED}❌ ERRO: Node.js não está instalado!${NC}"
    echo ""
    echo "Baixe em: https://nodejs.org/"
    echo ""
    exit 1
fi

# Iniciar servidor
echo ""
echo "========================================"
echo "   Inteligente Park - Servidor HTTP"
echo "========================================"
echo ""
echo -e "${GREEN}✅ Inicializando servidor...${NC}"
echo ""

# Permitir configurar porta via argumento
PORT=${1:-8080}

echo -e "${GREEN}📱 Acesse: http://localhost:${PORT}${NC}"
echo ""
echo "Pressione Ctrl+C para parar."
echo ""

node server.js "$PORT"
