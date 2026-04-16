import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './AppWrapper.jsx';
import './index.css';

// Global error handlers
window.addEventListener('error', (event) => {
  console.error('❌ Erro global:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Promise rejeitada:', event.reason);
});

const root = document.getElementById('root');

if (!root) {
  document.body.innerHTML = '<div style="padding: 20px; color: red; font-size: 18px;">❌ Elemento root não encontrado no HTML!</div>';
} else {
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <AppWrapper />
      </React.StrictMode>
    );
    
    console.log('✅ React renderizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao renderizar:', error);
    root.innerHTML = `
      <div style="padding: 40px; font-family: monospace; background: #fee; color: #c00;">
        <h1>❌ ERRO AO RENDERIZAR</h1>
        <pre>${error.message || error}</pre>
        <hr />
        <p>Abra o DevTools (F12) para mais detalhes no console.</p>
      </div>
    `;
  }
}
