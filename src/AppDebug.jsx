import React from 'react';

console.log('ℹ️ App.jsx está sendo carregado...');

// Log de inicialização
try {
  console.log('✅ React importado com sucesso');
  console.log('✅ DOM pronto.');
} catch (error) {
  console.error('❌ Erro crítico:', error);
}

export default function AppDebug() {
  React.useEffect(() => {
    console.log('🔵 AppDebug montado');
    return () => console.log('🔴 AppDebug desmontado');
  }, []);

  return (
    <div style={{ padding: '20px', fontSize: '18px' }}>
      <h1>✅ Componente carregou!</h1>
      <p>Se você vê isso, o React está funcionando.</p>
    </div>
  );
}
