/**
 * Pages - Direct imports to avoid lazy loading issues
 */

import React, { Suspense } from 'react';
import { LoadingAnimation } from '../components/AnimationManager';
import DESIGN from '../design-system';

// Direct imports - no lazy loading
import { PaginaCadastroPublico } from '../PaginaCadastroPublico';
import { PaginaCadastroMensalista } from '../components/PaginaCadastroMensalista';
import PaginaLogin from '../components/PaginaLogin';
import { AbaSolicitacoesMensalistas } from '../components/AbaSolicitacoesMensalistas';

// Fallback Loading Component
const PageLoadingFallback = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(to bottom right, ${DESIGN.colors.primary[50]}, ${DESIGN.colors.neutral[50]})`
  }}>
    <div style={{
      textAlign: 'center',
      padding: DESIGN.spacing.lg
    }}>
      <LoadingAnimation size={60} />
      <p style={{
        marginTop: DESIGN.spacing.lg,
        color: DESIGN.colors.neutral[600],
        fontSize: DESIGN.typography.sizes.md
      }}>
        Carregando página...
      </p>
    </div>
  </div>
);

// Error Boundary para páginas lazy-loaded
class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Erro ao carregar página:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fee'
        }}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2>❌ Erro ao carregar página</h2>
            <p>Por favor, recarregue a página.</p>
            <button onClick={() => window.location.reload()}>
              Recarregar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Direct exports - no lazy loading
export const PaginaCadastroPublicoLazy = PaginaCadastroPublico;
export const PaginaCadastroMensalistaLazy = PaginaCadastroMensalista;
export const PaginaLoginLazy = PaginaLogin;
export const AbaSolicitacoesMensalistasLazy = AbaSolicitacoesMensalistas;

// Wrapper para carregar páginas
export const LazyPage = ({ component: Component, fallback = <PageLoadingFallback />, ...props }) => (
  <PageErrorBoundary>
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  </PageErrorBoundary>
);

// Preload function - simplified
export const prefetchPages = () => {
  console.log('Pages loaded');
};
