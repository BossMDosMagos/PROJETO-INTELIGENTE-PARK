import { Component } from 'react';
import AppOriginal from './App.jsx';

console.log('🔵 AppWrapper.jsx carregando...');
console.log('✅ App.jsx importado diretamente!');

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <AppOriginal />
    </ErrorBoundary>
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
