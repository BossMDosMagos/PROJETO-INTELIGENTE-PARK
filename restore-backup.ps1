#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Script para restaurar backup do PROJETO-ANTIGO-PARK

.DESCRIPTION
    Extrai o arquivo ZIP de backup e reinstala dependências

.PARAMETER BackupFile
    Caminho do arquivo .zip de backup

.EXAMPLE
    .\restore-backup.ps1 -BackupFile "PROJETO-ANTIGO-PARK_BACKUP_2026-03-04_011935_FONTE.zip"

.NOTES
    Execute este script a partir do diretório pai do projeto
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile
)

# Cores
$Green = "`e[32m"
$Red = "`e[31m"
$Yellow = "`e[33m"
$Reset = "`e[0m"

Write-Host "${Green}╔════════════════════════════════════════════════════╗"
Write-Host "║   RESTAURAÇÃO DE BACKUP - PROJETO-ANTIGO-PARK       ║"
Write-Host "╚════════════════════════════════════════════════════╝${Reset}" 

# Verificar se arquivo existe
if (-not (Test-Path $BackupFile)) {
    Write-Host "${Red}❌ ERRO: Arquivo de backup não encontrado: $BackupFile${Reset}"
    exit 1
}

Write-Host "${Green}✓ Arquivo encontrado: $(Get-Item $BackupFile | Select-Object -ExpandProperty FullName)${Reset}"
Write-Host ""

# Perguntar confirmação
Write-Host "${Yellow}⚠️  Isto irá SOBRESCREVER os arquivos atuais do projeto!${Reset}"
$confirm = Read-Host "Deseja continuar? (S/N)"

if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "${Red}Operação cancelada.${Reset}"
    exit 0
}

# Criar pasta temporária
$tempDir = "$env:TEMP\projeto-restore-$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
Write-Host "${Green}✓ Pasta temporária criada: $tempDir${Reset}"
Write-Host ""

# Extrair backup
Write-Host "Extraindo arquivo de backup..."
Expand-Archive -Path $BackupFile -DestinationPath $tempDir -Force

if ($LASTEXITCODE -ne 0) {
    Write-Host "${Red}❌ ERRO ao extrair arquivo${Reset}"
    Remove-Item -Recurse $tempDir -Force
    exit 1
}

Write-Host "${Green}✓ Arquivo extraído com sucesso${Reset}"
Write-Host ""

# Copiar arquivos
Write-Host "Copiando arquivos para o projeto..."
$projectRoot = "."

$items = @(
    "src",
    "public", 
    "package.json",
    "package-lock.json",
    "vite.config.js",
    "tailwind.config.js",
    "postcss.config.js",
    "index.html"
)

foreach ($item in $items) {
    $source = Join-Path $tempDir $item
    $dest = Join-Path $projectRoot $item
    
    if (Test-Path $source) {
        if (Test-Path $dest) {
            Remove-Item -Recurse -Force $dest
        }
        Copy-Item -Recurse -Force $source -Destination $dest
        Write-Host "${Green}  ✓ Copiado: $item${Reset}"
    }
}

Write-Host "${Green}✓ Arquivos copiados${Reset}"
Write-Host ""

# Limpar pasta temporária
Remove-Item -Recurse -Force $tempDir
Write-Host "${Green}✓ Arquivo temporário removido${Reset}"
Write-Host ""

# Reinstalar dependências
Write-Host "${Yellow}Reinstalando dependências com npm...${Reset}"
Write-Host ""

npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "${Red}❌ ERRO ao instalar dependências${Reset}"
    exit 1
}

Write-Host ""
Write-Host "${Green}✓ Dependências instaladas${Reset}"
Write-Host ""

# Resumo
Write-Host "${Green}╔════════════════════════════════════════════════════╗"
Write-Host "║              RESTAURAÇÃO CONCLUÍDA! ✓                ║"
Write-Host "╠════════════════════════════════════════════════════╣"
Write-Host "║  Próximos passos:                                  ║"
Write-Host "║                                                    ║"
Write-Host "║  1. Abra um terminal e execute:                   ║"
Write-Host "║     npx vite                                       ║"
Write-Host "║                                                    ║"
Write-Host "║  2. Abra no navegador:                            ║"
Write-Host "║     http://localhost:3000/                        ║"
Write-Host "║                                                    ║"
Write-Host "║  3. Verifique se tudo está funcionando            ║"
Write-Host "╚════════════════════════════════════════════════════╝${Reset}"

exit 0
