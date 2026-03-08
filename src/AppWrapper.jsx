import { Suspense, lazy, Component } from 'react';

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
      <ErrorBoundary>
        <AppOriginal />
      </ErrorBoundary>
    </Suspense>
  );
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('❌ Erro de renderização capturado:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fee',
          color: '#c33',
          fontFamily: 'system-ui, sans-serif',
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #c00',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            maxWidth: '800px',
            width: '100%',
            padding: '24px'
          }}>
            <h1 style={{ marginTop: 0, marginBottom: '12px' }}>Erro ao renderizar</h1>
            <p style={{ marginTop: 0, color: '#a00' }}>
              Ocorreu um erro na interface. Abra o console do navegador para detalhes.
            </p>
            <pre style={{
              marginTop: '16px',
              backgroundColor: '#fdf2f2',
              color: '#7f1d1d',
              padding: '12px',
              borderRadius: '6px',
              overflow: 'auto'
            }}>
              {String(this.state.error?.message || this.state.error)}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
