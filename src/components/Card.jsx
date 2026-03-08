import React from 'react';
import DESIGN from '../design-system';

/**
 * Component: Card
 * Reusable card container with design system styling
 * 
 * @param {ReactNode} children - Card content
 * @param {string} title - Card title (optional)
 * @param {string} subtitle - Card subtitle (optional)
 * @param {string} variant - Visual variant: 'default', 'primary', 'success', 'warning', 'danger'
 * @param {boolean} shadow - Show shadow effect (default: true)
 * @param {string} padding - Padding size: 'sm', 'md', 'lg' (default: 'md')
 * @param {function} onClick - Click handler (makes card clickable)
 * @param {boolean} interactive - Enable hover effects
 * @param {string} className - Additional CSS classes
 * @param {*} otherProps - Any other props
 * 
 * @example
 * <Card title="Veículos" variant="primary">
 *   <p>Conteúdo do card</p>
 * </Card>
 */
export function Card({
  children,
  title = '',
  subtitle = '',
  variant = 'default',
  shadow = true,
  padding = 'md',
  onClick,
  interactive = false,
  className = '',
  gradient = '',
  glass = false,
  ...otherProps
}) {
  const variantStyles = {
    default: {
      bg: 'white',
      border: `1px solid ${DESIGN.colors.neutral[200]}`,
      text: DESIGN.colors.neutral[900]
    },
    primary: {
      bg: DESIGN.colors.primary[50],
      border: `2px solid ${DESIGN.colors.primary[300]}`,
      text: DESIGN.colors.primary[900]
    },
    success: {
      bg: DESIGN.colors.success[50],
      border: `2px solid ${DESIGN.colors.success[300]}`,
      text: DESIGN.colors.success[900]
    },
    warning: {
      bg: DESIGN.colors.warning[50],
      border: `2px solid ${DESIGN.colors.warning[300]}`,
      text: DESIGN.colors.warning[900]
    },
    danger: {
      bg: DESIGN.colors.danger[50],
      border: `2px solid ${DESIGN.colors.danger[300]}`,
      text: DESIGN.colors.danger[900]
    }
  };

  const variantStyle = variantStyles[variant] || variantStyles.default;

  const paddingMap = {
    sm: DESIGN.spacing.sm,
    md: DESIGN.spacing.md,
    lg: DESIGN.spacing.lg
  };

  const cardPadding = paddingMap[padding] || paddingMap.md;

  const shadowStyle = shadow ? {
    boxShadow: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
  } : {};

  const interactiveStyle = interactive || onClick ? {
    cursor: 'pointer',
    transition: `all ${DESIGN.transition.base}`,
    transform: 'scale(1)'
  } : {};

  const gradientBg = gradient && DESIGN.gradients[gradient] ? DESIGN.gradients[gradient] : null;
  const isColored = Boolean(gradientBg);
  const textColor = isColored ? 'white' : variantStyle.text;
  const baseBackground = glass
    ? DESIGN.glass.background
    : (gradientBg || variantStyle.bg);
  const baseBorder = glass
    ? DESIGN.glass.border
    : variantStyle.border;
  const baseShadow = glass ? DESIGN.glass.shadow : shadowStyle.boxShadow;
  const baseBackdrop = glass ? DESIGN.glass.blur : undefined;

  return (
    <div
      onClick={onClick}
      style={{
        background: baseBackground,
        backgroundImage: gradientBg || undefined,
        border: baseBorder,
        borderRadius: DESIGN.border.radius.lg,
        padding: `${cardPadding}px`,
        color: textColor,
        boxShadow: baseShadow,
        backdropFilter: baseBackdrop,
        ...interactiveStyle
      }}
      className={className}
      onMouseEnter={(e) => {
        if (interactive || onClick) {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = DESIGN.shadow.md;
        }
      }}
      onMouseLeave={(e) => {
        if (interactive || onClick) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = baseShadow;
        }
      }}
      {...otherProps}
    >
      {title && (
        <div style={{ marginBottom: `${DESIGN.spacing.md}px` }}>
          <h2
            style={{
              fontSize: DESIGN.typography.sizes.lg,
              fontWeight: '700',
              margin: 0,
              marginBottom: subtitle ? `${DESIGN.spacing.xs}px` : 0
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              style={{
                fontSize: DESIGN.typography.sizes.sm,
                color: isColored ? 'rgba(255,255,255,0.85)' : DESIGN.colors.neutral[600],
                margin: 0
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  );
}

/**
 * Component: CardGrid
 * Responsive grid container for cards
 */
export function CardGrid({
  children,
  columns = 2,
  gap = 'md',
  className = '',
  ...otherProps
}) {
  const gapMap = {
    sm: DESIGN.spacing.sm,
    md: DESIGN.spacing.md,
    lg: DESIGN.spacing.lg
  };

  const gapValue = gapMap[gap] || gapMap.md;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${Math.max(200, Math.floor((100 / columns)))}%, 1fr))`,
        gap: `${gapValue}px`,
        width: '100%'
      }}
      className={className}
      {...otherProps}
    >
      {children}
    </div>
  );
}

/**
 * Component: Alert
 * Alert/notification display component
 */
export function Alert({
  children,
  type = 'info',
  title = '',
  dismissible = false,
  onDismiss,
  icon = null,
  className = '',
  ...otherProps
}) {
  const typeStyles = {
    info: {
      bg: DESIGN.colors.primary[50],
      border: `2px solid ${DESIGN.colors.primary[300]}`,
      text: DESIGN.colors.primary[900],
      icon: 'ℹ️'
    },
    success: {
      bg: DESIGN.colors.success[50],
      border: `2px solid ${DESIGN.colors.success[300]}`,
      text: DESIGN.colors.success[900],
      icon: '✅'
    },
    warning: {
      bg: DESIGN.colors.warning[50],
      border: `2px solid ${DESIGN.colors.warning[300]}`,
      text: DESIGN.colors.warning[900],
      icon: '⚠️'
    },
    danger: {
      bg: DESIGN.colors.danger[50],
      border: `2px solid ${DESIGN.colors.danger[300]}`,
      text: DESIGN.colors.danger[900],
      icon: '❌'
    }
  };

  const typeStyle = typeStyles[type] || typeStyles.info;

  return (
    <div
      style={{
        backgroundColor: typeStyle.bg,
        border: typeStyle.border,
        borderRadius: DESIGN.border.radius.md,
        padding: `${DESIGN.spacing.md}px ${DESIGN.spacing.lg}px`,
        color: typeStyle.text,
        display: 'flex',
        alignItems: 'flex-start',
        gap: `${DESIGN.spacing.md}px`
      }}
      className={className}
      {...otherProps}
    >
      {(icon || typeStyle.icon) && (
        <span style={{ fontSize: '20px', marginTop: '2px', flexShrink: 0 }}>
          {icon || typeStyle.icon}
        </span>
      )}

      <div style={{ flex: 1 }}>
        {title && (
          <h4
            style={{
              margin: 0,
              marginBottom: `${DESIGN.spacing.xs}px`,
              fontWeight: '700',
              fontSize: DESIGN.typography.sizes.base
            }}
          >
            {title}
          </h4>
        )}
        <div style={{ fontSize: DESIGN.typography.sizes.sm }}>
          {children}
        </div>
      </div>

      {dismissible && (
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: typeStyle.text,
            cursor: 'pointer',
            fontSize: '20px',
            padding: 0,
            flexShrink: 0,
            opacity: 0.7,
            transition: `opacity ${DESIGN.transition.fast}`,
            ':hover': { opacity: 1 }
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.7'}
        >
          ✕
        </button>
      )}
    </div>
  );
}

/**
 * Component: Badge
 * Small label/badge component
 */
export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...otherProps
}) {
  const variantStyles = {
    neutral: {
      bg: DESIGN.colors.neutral[200],
      text: DESIGN.colors.neutral[900]
    },
    primary: {
      bg: DESIGN.colors.primary[500],
      text: 'white'
    },
    success: {
      bg: DESIGN.colors.success[500],
      text: 'white'
    },
    warning: {
      bg: DESIGN.colors.warning[500],
      text: 'white'
    },
    danger: {
      bg: DESIGN.colors.danger[500],
      text: 'white'
    }
  };

  const sizeStyles = {
    sm: {
      fontSize: DESIGN.typography.sizes.xs,
      padding: `${DESIGN.spacing.xs}px ${DESIGN.spacing.sm}px`
    },
    md: {
      fontSize: DESIGN.typography.sizes.sm,
      padding: `${DESIGN.spacing.xs}px ${DESIGN.spacing.md}px`
    },
    lg: {
      fontSize: DESIGN.typography.sizes.base,
      padding: `${DESIGN.spacing.sm}px ${DESIGN.spacing.lg}px`
    }
  };

  const variantStyle = variantStyles[variant] || variantStyles.neutral;
  const sizeStyle = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      style={{
        backgroundColor: variantStyle.bg,
        color: variantStyle.text,
        borderRadius: '999px',
        fontWeight: '600',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        ...sizeStyle
      }}
      className={className}
      {...otherProps}
    >
      {children}
    </span>
  );
}

export default Card;
