import { Suspense, lazy } from 'react';

console.log('🔵 AppWrapper.jsx carregando...');
console.log('Versão do React disponível?', typeof Suspense, typeof lazy);

// Tenta carregar o App original com tratamento de erro
const AppOriginal = lazy(() => {
  console.log('Iniciando lazy load de App.jsx...');
  return import('./App.jsx')
    .then(module => {
      console.log('✅ App.jsx importado com sucesso!', module);
      return module;
    })
    .catch(error => {
      console.error('❌ Erro ao importar App.jsx:');
      console.error('- Mensagem:', error.message);
      console.error('- Stack:', error.stack);
      console.error('- Objeto completo:', error);
      
      // Retorna um componente que mostra o erro
      return {
        default: () => (
          <div style={{
            padding: '40px',
            backgroundColor: '#fee',
            color: '#c33',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6'
          }}>
            <h1>❌ ERRO AO CARREGAR App.jsx</h1>
            <pre style={{ 
              backgroundColor: '#fff',
              border: '1px solid #c00',
              padding: '20px',
              borderRadius: '4px',
              overflow: 'auto'
            }}>
{`Erro: ${error.message}

${error.stack}`}
            </pre>
            <p>Abra o DevTools (F12) e vá à aba Console para mais detalhes.</p>
          </div>
        )
      };
    });
});

export default function AppWrapper() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f9ff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>⏳ Carregando aplicação...</h2>
          <p>Aguarde um momento...</p>
        </div>
      </div>
    }>
      <AppOriginal />
    </Suspense>
  );
}
