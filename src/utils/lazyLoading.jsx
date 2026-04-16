import React, { Suspense, lazy } from 'react';
import DESIGN from '../design-system';
import { LoadingAnimation } from '../components/AnimationManager';

/**
 * LazyPageLoader
 * Wrapper para lazy load pages com Suspense fallback
 */
export function LazyPageLoader({ children }) {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: DESIGN.spacing.md,
            backgroundColor: DESIGN.colors.neutral[50]
          }}
        >
          <LoadingAnimation size={50} color={DESIGN.colors.primary[500]} />
          <p style={{ color: DESIGN.colors.neutral[600], fontSize: DESIGN.typography.sizes.sm }}>
            Carregando página...
          </p>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

/**
 * createLazyPage
 * Factory function para criar pages lazy-loaded
 * 
 * @example
 * const HomePage = createLazyPage(() => import('./pages/HomePage'));
 */
export function createLazyPage(importFunc) {
  const Component = lazy(importFunc);
  
  return (props) => (
    <LazyPageLoader>
      <Component {...props} />
    </LazyPageLoader>
  );
}

/**
 * Lazy component loader helper
 * Para lazy-load componentes pesados
 */
export function createLazyComponent(importFunc, fallback = null) {
  const Component = lazy(importFunc);
  
  return (props) => (
    <Suspense fallback={fallback || null}>
      <Component {...props} />
    </Suspense>
  );
}

/**
 * Lazy Container
 * Wrapper simples para Suspense
 */
export function LazyContainer({
  children,
  fallback = null,
  loadingText = 'Carregando...'
}) {
  return (
    <Suspense
      fallback={
        fallback || (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: DESIGN.spacing.lg,
            color: DESIGN.colors.neutral[500]
          }}>
            <LoadingAnimation size={30} />
            <span style={{ marginLeft: DESIGN.spacing.md }}>{loadingText}</span>
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
}

/**
 * Prefetch Pages
 * Prefetch página quando mouse entra num link
 */
export const prefetchPage = (() => {
  const prefetched = new Set();
  
  return (pageImport) => (ref) => {
    if (ref && !prefetched.has(pageImport)) {
      setTimeout(() => {
        pageImport().catch(() => {});
        prefetched.add(pageImport);
      }, 100);
    }
  };
})();

/**
 * Code splitting strategy para App.jsx
 * 
 * ANTES (Monolítico):
 * import { HomePage } from './pages/HomePage'
 * 
 * DEPOIS (Code Split):
 * const HomePage = createLazyPage(() => import('./pages/HomePage'))
 * 
 * Com Suspense boundary automaticamente adicionado
 */

export const createOptimizedPageLoader = (importFunc, errorFallback = null) => {
  const Lazy = lazy(importFunc);
  
  return (props) => (
    <LazyPageLoader>
      <ErrorBoundary fallback={errorFallback}>
        <Lazy {...props} />
      </ErrorBoundary>
    </LazyPageLoader>
  );
};

/**
 * Error Boundary para lazy-loaded components
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in lazy component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          padding: DESIGN.spacing.lg,
          color: DESIGN.colors.danger[600],
          backgroundColor: DESIGN.colors.danger[50],
          borderRadius: DESIGN.border.radius.md
        }}>
          <h3>Erro ao carregar página</h3>
          <p>{this.state.error?.message}</p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: `${DESIGN.spacing.sm}px ${DESIGN.spacing.md}px`,
              backgroundColor: DESIGN.colors.danger[600],
              color: 'white',
              border: 'none',
              borderRadius: DESIGN.border.radius.sm,
              cursor: 'pointer'
            }}
          >
            Recarregar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Chunk hint helper
 * Adicione ao seu vite.config.js para otimizar chunks:
 * 
 * export default {
 *   build: {
 *     rollupOptions: {
 *       output: {
 *         manualChunks: {
 *           'vendor': ['react', 'react-dom'],
 *           'animations': ['framer-motion'],
 *           'components': ['./src/components']
 *         }
 *       }
 *     }
 *   }
 * }
 */

export default {
  LazyPageLoader,
  createLazyPage,
  createLazyComponent,
  LazyContainer,
  prefetchPage,
  createOptimizedPageLoader,
  ErrorBoundary
};
