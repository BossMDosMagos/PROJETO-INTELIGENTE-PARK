import React from 'react';

console.log('🔵 App Teste carregando...');

export default function AppTeste() {
  console.log('✅ App Teste renderizando...');
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f9ff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#1e40af' }}>
          ✅ Aplicação Carregou!
        </h1>
        
        <p style={{  color: '#666', fontSize: '16px', marginBottom: '20px', lineHeight: '1.6' }}>
          Se você consegue ver este message, o React e a aplicação estão funcionando corretamente.
        </p>

        <div style={{
          backgroundColor: '#dbeafe',
          border: '2px solid #0284c7',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <h2 style={{ marginTop: 0, color: '#0284c7', fontSize: '18px' }}>✅ Status:</h2>
          <ul style={{ margin: '10px 0', paddingLeft: '20px', color: '#0c4a6e' }}>
            <li>React: Funcionando ✓</li>
            <li>JSX: Renderizando ✓</li>
            <li>Servidor: Conectado ✓</li>
            <li>CSS: Carregado ✓</li>
          </ul>
        </div>

        <p style={{ fontSize: '14px', color: '#999', fontFamily: 'monospace' }}>
          App.jsx foi simplificado p diagnosticar o problema da "tela branca".
        </p>
      </div>
    </div>
  );
}
