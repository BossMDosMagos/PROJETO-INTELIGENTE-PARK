#!/usr/bin/env node
/**
 * Servidor HTTP Simples para Inteligente Park
 * 
 * Uso:
 *   node server.js              (porta 8080 padrão)
 *   node server.js 3000         (porta customizada)
 * 
 * Acesse: http://localhost:8080
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import os from 'os';
import { fileURLToPath } from 'url';

// Get __dirname equivalente em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Porta padrão
const PORT = process.argv[2] || 8080;

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jsx': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webfont': 'font/woff2',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
  // Parse URL
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURI(parsedUrl.pathname);

  // Remove leading "/" se existir
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Construir caminho seguro
  const basePath = path.join(__dirname, 'dist');
  const filePath = path.normalize(path.join(basePath, pathname));

  // Garantir que o arquivo está dentro de basePath (segurança)
  if (!filePath.startsWith(basePath)) {
    res.statusCode = 403;
    res.end('Acesso negado');
    return;
  }

  // Tentar ler o arquivo
  fs.stat(filePath, (err, stats) => {
    if (err) {
      // Arquivo não encontrado - tenta index.html (SPA)
      const indexPath = path.join(basePath, 'index.html');
      fs.readFile(indexPath, 'utf8', (readErr, data) => {
        if (readErr) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>404 - Não Encontrado</title>
              <style>
                * { margin: 0; padding: 0; }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                }
                .container {
                  text-align: center;
                  padding: 2rem;
                }
                h1 { font-size: 3rem; margin-bottom: 1rem; }
                p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
                a {
                  display: inline-block;
                  padding: 0.75rem 1.5rem;
                  background: white;
                  color: #667eea;
                  text-decoration: none;
                  border-radius: 0.5rem;
                  font-weight: 600;
                  transition: transform 0.2s;
                }
                a:hover { transform: scale(1.05); }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>404</h1>
                <p>Página não encontrada: ${pathname}</p>
                <a href="/">Voltar para Home</a>
              </div>
            </body>
            </html>
          `);
          return;
        }

        // Retornar index.html para SPA
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.end(data);
      });
      return;
    }

    // É um diretório? Servir index.html
    if (stats.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      fs.readFile(indexPath, 'utf8', (readErr, data) => {
        if (readErr) {
          res.statusCode = 403;
          res.end('Acesso a diretório negado');
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(data);
      });
      return;
    }

    // É um arquivo
    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.statusCode = 500;
        res.end('Erro ao ler arquivo');
        return;
      }

      // Detectar MIME type
      const ext = path.extname(filePath).toLowerCase();
      const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

      // Headers de cache inteligentes
      if (ext === '.js' || ext === '.css') {
        // Assets compilados - cache agressivo
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (ext === '.html') {
        // HTML - sem cache
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      } else {
        // Outros - cache moderado
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }

      // CORS headers (para desenvolvimento)
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

      res.statusCode = 200;
      res.setHeader('Content-Type', mimeType);
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║     🚀 Inteligente Park - Servidor     ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ Servidor rodando!`);
  console.log(`📱 Local:   http://localhost:${PORT}`);
  console.log(`🌐 Network: http://${getLocalIP()}:${PORT}`);
  console.log('');
  console.log('💡 Dica: Pressione Ctrl+C para parar');
  console.log('');
});

// Função para obter IP local
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // IPv4 e não loopback
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Handle errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} está em uso!`);
    console.error(`   Tente: node server.js ${PORT + 1}`);
    process.exit(1);
  }
  throw err;
});
