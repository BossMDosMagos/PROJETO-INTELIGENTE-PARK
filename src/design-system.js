/**
 * DESIGN SYSTEM - Inteligente Park Estacionamentos
 * Paleta de cores, tipografia, espaçamento e componentes padrão
 * Mantém consistência visual em toda a aplicação
 */

export const DESIGN = {
  // ========================================
  // PALETA DE CORES
  // ========================================
  colors: {
    // Primária: Azul profissional
    primary: {
      50: '#f0f7ff',    // Mais claro
      100: '#e0efff',
      200: '#bae3ff',
      300: '#7ab8ff',
      400: '#3b82f6',   // Cor principal
      500: '#1e40af',   // Variação mais escura
      600: '#1d3a8a',
      700: '#1e3a8a',
      800: '#1e3a8a',
      900: '#172554'
    },

    // Secundária: Verde (sucesso/sincronizado)
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#22c55e',   // Verde principal
      500: '#16a34a',
      600: '#15803d',
      700: '#15803d',
      800: '#166534',
      900: '#14532d'
    },

    // Atenção: Laranja (offline/sincronização)
    warning: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',   // Laranja principal
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12'
    },

    // Perigo: Vermelho (erro/RLS disabled)
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',   // Vermelho principal
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d'
    },

    // Neutros: Cinzas profissionais
    neutral: {
      50: '#f9fafb',    // Quase branco
      100: '#f3f4f6',   // Fundo claro
      200: '#e5e7eb',   // Bordas leves
      300: '#d1d5db',   // Bordas
      400: '#9ca3af',   // Texto secundário
      500: '#6b7280',   // Texto terciário
      600: '#4b5563',   // Texto principal (dark)
      700: '#374151',   // Título
      800: '#1f2937',   // Texto escuro
      900: '#111827'    // Preto profissional
    },

    // Funcional
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent'
  },

  // ========================================
  // TIPOGRAFIA
  // ========================================
  typography: {
    // Família de fontes
    family: {
      base: "'Inter', 'Segoe UI', Roboto, system-ui, sans-serif",
      mono: "'Monaco', 'Courier New', monospace"
    },

    // Escalas de tamanho (mobile-first)
    sizes: {
      xs:   '0.75rem',    // 12px - Labels, badges
      sm:   '0.875rem',   // 14px - Texto pequeno
      base: '1rem',       // 16px - Corpo padrão
      lg:   '1.125rem',   // 18px - Texto grande
      xl:   '1.25rem',    // 20px - Subtítulo
      '2xl': '1.5rem',    // 24px - Títulos pequenos
      '3xl': '1.875rem',  // 30px - Títulos médios
      '4xl': '2.25rem',   // 36px - Títulos grandes
      '5xl': '3rem'       // 48px - Heróis
    },

    // Pesos de fonte
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },

    // Estilos predefinidos
    styles: {
      hero: {
        fontSize: 'clamp(1.5rem, 5vw, 3rem)',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em'
      },
      h1: {
        fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: '-0.01em'
      },
      h2: {
        fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: '-0.01em'
      },
      h3: {
        fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
        fontWeight: 600,
        lineHeight: 1.4
      },
      h4: {
        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
        fontWeight: 600,
        lineHeight: 1.4
      },
      body: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.6,
        letterSpacing: '0.01em'
      },
      bodySmall: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: '0.01em'
      },
      label: {
        fontSize: '0.75rem',
        fontWeight: 600,
        lineHeight: 1.5,
        letterSpacing: '0.02em',
        textTransform: 'uppercase'
      },
      button: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.5,
        letterSpacing: '0.01em'
      }
    }
  },

  // ========================================
  // ESPAÇAMENTO (Escala 8px)
  // ========================================
  spacing: {
    xs:   '0.25rem',   // 4px
    sm:   '0.5rem',    // 8px
    md:   '1rem',      // 16px
    lg:   '1.5rem',    // 24px
    xl:   '2rem',      // 32px
    '2xl': '2.5rem',   // 40px
    '3xl': '3rem',     // 48px
    '4xl': '4rem',     // 64px
    '5xl': '5rem'      // 80px
  },

  // ========================================
  // BORDA E ARREDONDAMENTO
  // ========================================
  border: {
    radius: {
      none: '0',
      xs: '0.25rem',    // 4px
      sm: '0.375rem',   // 6px
      base: '0.5rem',   // 8px
      md: '0.75rem',    // 12px
      lg: '1rem',       // 16px
      xl: '1.5rem',     // 24px
      full: '9999px'
    },
    width: {
      none: '0',
      subtle: '1px',
      normal: '2px',
      bold: '3px'
    }
  },

  // ========================================
  // SOMBRAS (Elevação)
  // ========================================
  shadow: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },

  // ========================================
  // TRANSIÇÕES
  // ========================================
  transition: {
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1e40af 100%)',
    success: 'linear-gradient(135deg, #86efac 0%, #22c55e 50%, #15803d 100%)',
    warning: 'linear-gradient(135deg, #fdba74 0%, #f97316 50%, #c2410c 100%)',
    danger: 'linear-gradient(135deg, #fca5a5 0%, #ef4444 50%, #b91c1c 100%)',
    neutral: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 50%, #d1d5db 100%)'
  },
  glass: {
    background: 'rgba(255,255,255,0.85)',
    blur: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.35)',
    shadow: '0 10px 30px rgba(16,24,40,0.08)'
  },

  // ========================================
  // BREAKPOINTS (Mobile-first)
  // ========================================
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // ========================================
  // DIMENSÕES
  // ========================================
  size: {
    // Ícones
    icon: {
      xs: '16px',
      sm: '20px',
      base: '24px',
      md: '32px',
      lg: '48px',
      xl: '64px'
    },
    // Touch targets (mínimo 48x48px)
    touch: '48px',
    // Max-width de containers
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      full: '100%'
    }
  },

  // ========================================
  // Z-INDEX
  // ========================================
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
    notification: 80
  }
};

/**
 * Utilitários de cor com opacidade
 */
export const colorWithOpacity = (color, opacity) => {
  if (!color.startsWith('#')) return color;
  const hex = color.slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Temas predefinidos
 */
export const themes = {
  light: {
    background: {
      primary: DESIGN.colors.white,
      secondary: DESIGN.colors.neutral[50],
      tertiary: DESIGN.colors.neutral[100]
    },
    text: {
      primary: DESIGN.colors.neutral[900],
      secondary: DESIGN.colors.neutral[600],
      tertiary: DESIGN.colors.neutral[500]
    },
    border: DESIGN.colors.neutral[200],
    shadow: DESIGN.shadow.base
  },
  dark: {
    background: {
      primary: DESIGN.colors.neutral[900],
      secondary: DESIGN.colors.neutral[800],
      tertiary: DESIGN.colors.neutral[700]
    },
    text: {
      primary: DESIGN.colors.white,
      secondary: DESIGN.colors.neutral[300],
      tertiary: DESIGN.colors.neutral[400]
    },
    border: DESIGN.colors.neutral[700],
    shadow: DESIGN.shadow.lg
  }
};

export default DESIGN;
