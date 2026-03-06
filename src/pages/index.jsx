/**
 * Lazy-loaded Pages für Código Splitting
 * - Code splitting automático para páginas principais
 * - Fallback loading animation
 * - Error boundaries para falhas de carregamento
 */

import React, { Suspense } from 'react';
import { LoadingAnimation } from '../components/AnimationManager';
import DESIGN from '../design-system';

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
    console.error('❌ Erro ao carregar página lazy:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(to br, ${DESIGN.colors.danger[50]}, ${DESIGN.colors.primary[50]})`
        }}>
          <div style={{
            textAlign: 'center',
            padding: DESIGN.spacing.lg,
            maxWidth: '500px'
          }}>
            <h2 style={{
              fontSize: DESIGN.typography.sizes.xl,
              fontWeight: 'bold',
              color: DESIGN.colors.danger[600],
              marginBottom: DESIGN.spacing.md
            }}>
              Erro ao carregar a página
            </h2>
            <p style={{
              color: DESIGN.colors.neutral[600],
              marginBottom: DESIGN.spacing.lg
            }}>
              Ocorreu um problema ao carregar a página. Por favor, recarregue.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: `${DESIGN.spacing.sm} ${DESIGN.spacing.md}`,
                backgroundColor: DESIGN.colors.primary[600],
                color: 'white',
                border: 'none',
                borderRadius: DESIGN.spacing.xs,
                cursor: 'pointer',
                fontSize: DESIGN.typography.sizes.md,
                fontWeight: 'bold'
              }}
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy Pages
export const PaginaCadastroPublicoLazy = React.lazy(() =>
  import('../PaginaCadastroPublico').then(m => ({ default: m.PaginaCadastroPublico }))
);

export const PaginaCadastroMensalistaLazy = React.lazy(() =>
  import('../components/PaginaCadastroMensalista').then(m => ({ default: m.PaginaCadastroMensalista }))
);

export const PaginaLoginLazy = React.lazy(() =>
  import('../components/PaginaLogin').then(m => ({ default: m.PaginaLogin }))
);

export const AbaSolicitacoesMensalistasLazy = React.lazy(() =>
  import('../components/AbaSolicitacoesMensalistas').then(m => ({ default: m.AbaSolicitacoesMensalistas }))
);

// Wrapper para carregar páginas lazy com suspense
export const LazyPage = ({ component: Component, fallback = <PageLoadingFallback />, ...props }) => (
  <PageErrorBoundary>
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  </PageErrorBoundary>
);

// Preload pages on hover (performance optimization)
export const prefetchPages = () => {
  // Preload on mouseenter ou touch
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Preload main pages after loading completes
      setTimeout(() => {
        // These will be imported into memory
        import('../PaginaCadastroPublico');
        import('../components/PaginaCadastroMensalista');
        import('../components/PaginaLogin');
      }, 2000);
    });
  }
};
