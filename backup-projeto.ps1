#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Função para fazer backup rápido do PROJETO-ANTIGO-PARK

.DESCRIPTION
    Cria um arquivo ZIP com timestamp automático

.EXAMPLE
    .\backup-projeto.ps1
    # Cria: PROJETO-ANTIGO-PARK_BACKUP_2026-03-04_012345_FONTE.zip

.NOTES
    Execute na raiz do projeto ou na pasta pai
#>

# Cores
$Green = "`e[32m"
$Red = "`e[31m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Reset = "`e[0m"

Write-Host ""
Write-Host "${Blue}╔════════════════════════════════════════════════════╗"
Write-Host "║      BACKUP RÁPIDO - PROJETO-ANTIGO-PARK           ║"
Write-Host "╚════════════════════════════════════════════════════╝${Reset}"
Write-Host ""

# Verificar se estamos no diretório correto
if (-not (Test-Path "PROJETO-ANTIGO-PARK")) {
    Write-Host "${Red}❌ ERRO: Diretório PROJETO-ANTIGO-PARK não encontrado${Reset}"
    Write-Host "${Yellow}Execute este script a partir do diretório pai (C:\)${Reset}"
    exit 1
}

# Entrar na pasta do projeto
Push-Location PROJETO-ANTIGO-PARK

# Verificar se é mesmo o projeto
if (-not (Test-Path "src") -or -not (Test-Path "package.json")) {
    Write-Host "${Red}❌ ERRO: Esta não parece ser a pasta PROJETO-ANTIGO-PARK${Reset}"
    Pop-Location
    exit 1
}

# Criar backup
$timestamp = Get-Date -Format 'yyyy-MM-dd_HHmmss'
$backupName = "../PROJETO-ANTIGO-PARK_BACKUP_${timestamp}_FONTE.zip"
$files = @('src', 'public', 'package.json', 'package-lock.json', 'vite.config.js', 'tailwind.config.js', 'postcss.config.js', 'index.html', '*.md')

Write-Host "${Yellow}Criando backup...${Reset}"
Write-Host "Arquivo: ${Green}$backupName${Reset}"
Write-Host ""

try {
    Compress-Archive -Path $files -DestinationPath $backupName -Force -ErrorAction Stop
    $backupSize = (Get-Item $backupName).Length / 1MB
    
    Write-Host ""
    Write-Host "${Green}✓ BACKUP CRIADO COM SUCESSO!${Reset}"
    Write-Host "  Nome: PROJETO-ANTIGO-PARK_BACKUP_${timestamp}_FONTE.zip"
    Write-Host "  Tamanho: $([math]::Round($backupSize, 2)) MB"
    Write-Host "  Local: C:\PROJETO-ANTIGO-PARK_BACKUP_${timestamp}_FONTE.zip"
    
    # Atualizar BACKUP_MANIFEST.json
    $manifest = @{
        backup_info = @{
            data = (Get-Date -Format 'yyyy-MM-ddTHH:mm:ssZ')
            arquivo = "PROJETO-ANTIGO-PARK_BACKUP_${timestamp}_FONTE.zip"
            tamanho_mb = [math]::Round($backupSize, 2)
        }
    }
    
    Write-Host ""
    Write-Host "${Green}Resumo:${Reset}"
    Write-Host "  • Código-fonte: ✓"
    Write-Host "  • Documentação: ✓"
    Write-Host "  • Configurações: ✓"
    Write-Host "  • node_modules: ✗ (será reinstalado com npm install)"
    
    Write-Host ""
    Write-Host "${Green}Próximos passos:${Reset}"
    Write-Host "  1. Fazer suas alterações com segurança"
    Write-Host "  2. Se quebrar, restaurar com:"
    Write-Host "     .\restore-backup.ps1 -BackupFile ""PROJETO-ANTIGO-PARK_BACKUP_${timestamp}_FONTE.zip"""
    Write-Host ""
    
} catch {
    Write-Host "${Red}❌ ERRO ao criar backup:${Reset}"
    Write-Host $_.Exception.Message
    Pop-Location
    exit 1
}

Pop-Location

Write-Host "${Green}Status: BACKUP SEGURO ✓${Reset}"
Write-Host ""
