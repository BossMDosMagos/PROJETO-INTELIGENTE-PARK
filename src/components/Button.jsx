import React from 'react';
import DESIGN from '../design-system';

/**
 * BOTÃO REDESENHADO
 * Componentes de botão profissional com variações
 */

export function Button({
  children,
  variant = 'primary', // primary, secondary, danger, outline, ghost, disabled
  size = 'md', // sm, md, lg, xl
  fullWidth = false,
  icon: Icon,
  iconRight = false,
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  // Variações de cores
  const variants = {
    primary: {
      bg: DESIGN.colors.primary[400],
      text: 'white',
      hover: DESIGN.colors.primary[500],
      active: DESIGN.colors.primary[600],
      border: 'transparent'
    },
    secondary: {
      bg: DESIGN.colors.neutral[100],
      text: DESIGN.colors.primary[400],
      hover: DESIGN.colors.neutral[200],
      active: DESIGN.colors.neutral[300],
      border: DESIGN.colors.neutral[300]
    },
    danger: {
      bg: DESIGN.colors.danger[500],
      text: 'white',
      hover: DESIGN.colors.danger[600],
      active: DESIGN.colors.danger[700],
      border: 'transparent'
    },
    outline: {
      bg: 'transparent',
      text: DESIGN.colors.primary[400],
      hover: DESIGN.colors.primary[50],
      active: DESIGN.colors.primary[100],
      border: DESIGN.colors.primary[400]
    },
    ghost: {
      bg: 'transparent',
      text: DESIGN.colors.neutral[600],
      hover: DESIGN.colors.neutral[100],
      active: DESIGN.colors.neutral[200],
      border: 'transparent'
    },
    disabled: {
      bg: DESIGN.colors.neutral[200],
      text: DESIGN.colors.neutral[400],
      hover: DESIGN.colors.neutral[200],
      active: DESIGN.colors.neutral[200],
      border: 'transparent'
    }
  };

  const sizes = {
    sm: {
      padding: `${DESIGN.spacing.sm} ${DESIGN.spacing.md}`,
      fontSize: DESIGN.typography.sizes.sm,
      minHeight: '36px'
    },
    md: {
      padding: `${DESIGN.spacing.md} ${DESIGN.spacing.lg}`,
      fontSize: DESIGN.typography.sizes.base,
      minHeight: DESIGN.size.touch
    },
    lg: {
      padding: `${DESIGN.spacing.lg} ${DESIGN.spacing.xl}`,
      fontSize: DESIGN.typography.sizes.md,
      minHeight: '56px'
    },
    xl: {
      padding: `${DESIGN.spacing.xl} ${DESIGN.spacing['2xl']}`,
      fontSize: DESIGN.typography.sizes.lg,
      minHeight: '64px'
    }
  };

  const estilo = variants[disabled ? 'disabled' : variant];
  const sizeStyle = sizes[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        rounded-lg font-semibold transition-all
        flex items-center justify-center gap-2
        disabled:cursor-not-allowed
        active:scale-95
        focus-visible:outline-none focus-visible:ring-2
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      style={{
        backgroundColor: estilo.bg,
        color: estilo.text,
        border: `2px solid ${estilo.border}`,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        minHeight: sizeStyle.minHeight,
        minWidth: sizeStyle.minHeight, // Garantir que seja quadrado se não tiver width
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: DESIGN.transition.base,
        outline: '2px solid transparent',
        outlineOffset: '2px',
        boxShadow: 'none',
        ':hover': {
          backgroundColor: estilo.hover,
          boxShadow: DESIGN.shadow.md
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = estilo.hover;
        e.currentTarget.style.boxShadow = DESIGN.shadow.md;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = estilo.bg;
        e.currentTarget.style.boxShadow = 'none';
      }}
      {...props}
    >
      {loading && (
        <span className="inline-block animate-spin">
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" opacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        </span>
      )}

      {Icon && !iconRight && !loading && (
        <Icon size={20} />
      )}

      {children && <span>{children}</span>}

      {Icon && iconRight && !loading && (
        <Icon size={20} />
      )}
    </button>
  );
}

/**
 * GRUPO DE BOTÕES
 */
export function ButtonGroup({ children, vertical = false }) {
  return (
    <div className={`flex gap-2 ${vertical ? 'flex-col' : 'flex-row'}`}>
      {children}
    </div>
  );
}

export default Button;
