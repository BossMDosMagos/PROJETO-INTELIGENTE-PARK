import React, { useState, useEffect } from 'react';

console.log('🔵 App Simplificado carregando...');

function AppSimples() {
  const [contador, setContador] = useState(0);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    console.log('✅ useEffect rodou');
    try {
      console.log('🔍 Verificando imports...');
      // Testa imports críticos
      console.log('✅ React carregado');
    } catch (e) {
      console.error('❌ Erro:', e);
      setErro(e.message);
    }
  }, []);

  if (erro) {
    return (
      <div style={{ 
        padding: '40px', 
        backgroundColor: '#fee', 
        color: '#c33',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap'
      }}>
        <h1>❌ ERRO</h1>
        <pre>{erro}</pre>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1>✅ App Simplificado Carregou!</h1>
      <p>Se você vê isso, o React está funcionando corretamente.</p>
      <p>Contador: {contador}</p>
      <button
        onClick={() => setContador(c => c + 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#2563eb',
          color: '  white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Incrementar
      </button>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <h2>🔍 Verificação de Dependências:</h2>
        <ul>
          <li>React: ✅ Funcionando</li>
          <li>JSX: ✅ Renderizando</li>
          <li>Hooks: ✅ Disponíveis</li>
          <li>Estado: ✅ Funcionando ({contador} cliques)</li>
        </ul>
      </div>

      <p style={{ marginTop: '40px', color: '#666', fontSize: '12px' }}>
        Se você conseguiu ver este formulário,
 a próxima etapa é carregar o App.jsx original para diagnosticar o problema.
      </p>
    </div>
  );
}

export default AppSimples;
