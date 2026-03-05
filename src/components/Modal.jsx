import React, { useEffect } from 'react';
import DESIGN from '../design-system';

/**
 * Component: Modal
 * Reusable modal dialog with design system styling
 * 
 * @param {boolean} isOpen - Control modal visibility
 * @param {function} onClose - Handler when modal closes
 * @param {string} title - Modal title
 * @param {string} subtitle - Modal subtitle (optional)
 * @param {ReactNode} children - Modal content
 * @param {string} size - Modal size: 'sm', 'md', 'lg', 'xl' (default: 'md')
 * @param {boolean} closeOnBackdrop - Close when clicking backdrop (default: true)
 * @param {boolean} closeOnEscape - Close when pressing Escape (default: true)
 * @param {ReactNode} footer - Footer content (buttons, actions)
 * @param {string} className - Additional CSS classes
 * @param {*} otherProps - Any other props
 * 
 * @example
 * <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm Action">
 *   <p>Are you sure?</p>
 *   <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
 *     <Button variant="danger" onClick={handleConfirm}>Delete</Button>
 *     <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
 *   </div>
 * </Modal>
 */
export function Modal({
  isOpen = false,
  onClose,
  title = '',
  subtitle = '',
  children,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  footer = null,
  className = '',
  ...otherProps
}) {
  // Handle Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeMap = {
    sm: '360px',
    md: '500px',
    lg: '700px',
    xl: '900px'
  };

  const maxWidth = sizeMap[size] || sizeMap.md;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: DESIGN.zIndex.modal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: `${DESIGN.spacing.md}px`,
        animation: 'fadeIn 0.2s ease-in-out'
      }}
      onClick={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      {/* Modal Content */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: DESIGN.border.radius.lg,
          boxShadow: DESIGN.shadow.xl,
          maxWidth,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
        className={className}
        {...otherProps}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: `${DESIGN.spacing.lg}px`,
            borderBottom: `1px solid ${DESIGN.colors.neutral[200]}`,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: `${DESIGN.spacing.md}px`
          }}
        >
          <div style={{ flex: 1 }}>
            {title && (
              <h2
                style={{
                  margin: 0,
                  marginBottom: subtitle ? `${DESIGN.spacing.xs}px` : 0,
                  fontSize: DESIGN.typography.sizes.xl,
                  fontWeight: '700',
                  color: DESIGN.colors.neutral[900]
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                style={{
                  margin: 0,
                  fontSize: DESIGN.typography.sizes.sm,
                  color: DESIGN.colors.neutral[600]
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              color: DESIGN.colors.neutral[400],
              padding: 0,
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: DESIGN.border.radius.sm,
              transition: `all ${DESIGN.transition.fast}`,
              ':hover': {
                backgroundColor: DESIGN.colors.neutral[100],
                color: DESIGN.colors.neutral[600]
              }
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = DESIGN.colors.neutral[100];
              e.target.style.color = DESIGN.colors.neutral[600];
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = DESIGN.colors.neutral[400];
            }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: `${DESIGN.spacing.lg}px`,
            overflow: 'auto',
            flex: 1,
            color: DESIGN.colors.neutral[900]
          }}
        >
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div
            style={{
              padding: `${DESIGN.spacing.lg}px`,
              borderTop: `1px solid ${DESIGN.colors.neutral[200]}`,
              display: 'flex',
              gap: `${DESIGN.spacing.md}px`,
              justifyContent: 'flex-end',
              backgroundColor: DESIGN.colors.neutral[50]
            }}
          >
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Component: ConfirmDialog
 * Pre-built confirmation dialog
 */
export function ConfirmDialog({
  isOpen = false,
  onConfirm,
  onCancel,
  title = 'Confirmar Ação',
  message = 'Tem certeza que deseja prosseguir?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'warning',
  loading = false,
  ...otherProps
}) {
  const variantConfig = {
    info: { icon: 'ℹ️', color: 'primary' },
    success: { icon: '✅', color: 'success' },
    warning: { icon: '⚠️', color: 'warning' },
    danger: { icon: '❌', color: 'danger' }
  };

  const config = variantConfig[variant] || variantConfig.warning;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="sm"
      closeOnBackdrop={!loading}
      closeOnEscape={!loading}
      {...otherProps}
    >
      <div style={{ textAlign: 'center', marginBottom: `${DESIGN.spacing.lg}px` }}>
        <div style={{ fontSize: '48px', marginBottom: `${DESIGN.spacing.md}px` }}>
          {config.icon}
        </div>
        <p
          style={{
            fontSize: DESIGN.typography.sizes.base,
            color: DESIGN.colors.neutral[700],
            margin: 0,
            lineHeight: '1.5'
          }}
        >
          {message}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: `${DESIGN.spacing.md}px`,
          marginTop: `${DESIGN.spacing.lg}px`
        }}
      >
        <button
          onClick={onCancel}
          disabled={loading}
          style={{
            flex: 1,
            padding: `${DESIGN.spacing.md}px ${DESIGN.spacing.lg}px`,
            borderRadius: DESIGN.border.radius.md,
            border: `2px solid ${DESIGN.colors.neutral[300]}`,
            backgroundColor: 'white',
            color: DESIGN.colors.neutral[900],
            fontSize: DESIGN.typography.sizes.base,
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: `all ${DESIGN.transition.base}`,
            opacity: loading ? 0.6 : 1
          }}
        >
          {cancelText}
        </button>

        <button
          onClick={onConfirm}
          disabled={loading}
          style={{
            flex: 1,
            padding: `${DESIGN.spacing.md}px ${DESIGN.spacing.lg}px`,
            borderRadius: DESIGN.border.radius.md,
            border: 'none',
            backgroundColor: DESIGN.colors[config.color][600],
            color: 'white',
            fontSize: DESIGN.typography.sizes.base,
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: `all ${DESIGN.transition.base}`,
            opacity: loading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = DESIGN.colors[config.color][700];
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = DESIGN.colors[config.color][600];
          }}
        >
          {loading ? 'Processando...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}

/**
 * Component: Drawer (Slide-out panel)
 * For side panels, navigation menus, etc.
 */
export function Drawer({
  isOpen = false,
  onClose,
  title = '',
  children,
  position = 'right',
  width = '360px',
  ...otherProps
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isRtl = position === 'right';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: DESIGN.zIndex.modal,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        animation: 'fadeIn 0.2s ease-in-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          [position]: 0,
          bottom: 0,
          width,
          backgroundColor: 'white',
          boxShadow: isRtl ? '-4px 0 6px rgba(0, 0, 0, 0.1)' : '4px 0 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          animation: isRtl ? 'slideLeft 0.3s ease-out' : 'slideRight 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
        {...otherProps}
      >
        {/* Header */}
        <div
          style={{
            padding: `${DESIGN.spacing.lg}px`,
            borderBottom: `1px solid ${DESIGN.colors.neutral[200]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {title && (
            <h2
              style={{
                margin: 0,
                fontSize: DESIGN.typography.sizes.lg,
                fontWeight: '700',
                color: DESIGN.colors.neutral[900]
              }}
            >
              {title}
            </h2>
          )}

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              color: DESIGN.colors.neutral[400],
              padding: 0,
              marginLeft: 'auto'
            }}
            onMouseEnter={(e) => (e.target.style.color = DESIGN.colors.neutral[600])}
            onMouseLeave={(e) => (e.target.style.color = DESIGN.colors.neutral[400])}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: `${DESIGN.spacing.lg}px`
          }}
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Modal;
