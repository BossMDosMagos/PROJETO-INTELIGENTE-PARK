@echo off
REM Iniciar Servidor HTTP para Inteligente Park
REM Este arquivo usa o server.js para servir a aplicação

REM Verificar se dist/ existe
if not exist "dist\" (
    echo.
    echo ❌ ERRO: Pasta 'dist/' não encontrada!
    echo.
    echo Você precisa compilar o projeto primeiro:
    echo   npm run build
    echo.
    echo Depois rode novamente este arquivo.
    pause
    exit /b 1
)

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ ERRO: Node.js não está instalado!
    echo.
    echo Baixe em: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Iniciar servidor
echo.
echo ========================================
echo   Inteligente Park - Servidor HTTP
echo ========================================
echo.
echo ✅ Inicializando servidor...
echo.

REM Permitir configurar porta via argumento
if "%1"=="" (
    set PORT=8080
) else (
    set PORT=%1
)

echo 📱 Acesse: http://localhost:%PORT%
echo.
echo Pressione Ctrl+C para parar.
echo.

node server.js %PORT%

REM Se servidor parar com erro
if errorlevel 1 (
    echo.
    echo ❌ Servidor parou com erro!
    echo.
    pause
    exit /b 1
)
