import React from 'react';
import DESIGN from '../design-system';

/**
 * Component: Input
 * Reusable input field with design system styling
 * 
 * @param {string} type - Input type (text, number, email, password, date, etc.)
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {string} label - Label text (optional)
 * @param {string} variant - Visual variant: 'primary' (default), 'success', 'warning', 'error'
 * @param {boolean} fullWidth - Should take full width (default: true)
 * @param {boolean} disabled - Disabled state
 * @param {string} error - Error message to display
 * @param {string} hint - Helper text below input
 * @param {string} className - Additional CSS classes
 * @param {*} otherProps - Any other props to pass to input element
 * 
 * @example
 * <Input
 *   type="text"
 *   value={placa}
 *   onChange={(e) => setPlaca(e.target.value)}
 *   label="Placa do Veículo"
 *   placeholder="ABC-1234"
 *   error={placaError}
 * />
 */
export function Input({
  type = 'text',
  value = '',
  onChange,
  placeholder = '',
  label = '',
  variant = 'primary',
  fullWidth = true,
  disabled = false,
  error = '',
  hint = '',
  className = '',
  ...otherProps
}) {
  const variantStyles = {
    primary: {
      border: `2px solid ${DESIGN.colors.primary[300]}`,
      focusBorder: `2px solid ${DESIGN.colors.primary[600]}`,
      bg: DESIGN.colors.neutral[50],
      focusBg: 'white',
      text: DESIGN.colors.neutral[900]
    },
    success: {
      border: `2px solid ${DESIGN.colors.success[300]}`,
      focusBorder: `2px solid ${DESIGN.colors.success[600]}`,
      bg: DESIGN.colors.success[50],
      focusBg: 'white',
      text: DESIGN.colors.neutral[900]
    },
    warning: {
      border: `2px solid ${DESIGN.colors.warning[300]}`,
      focusBorder: `2px solid ${DESIGN.colors.warning[600]}`,
      bg: DESIGN.colors.warning[50],
      focusBg: 'white',
      text: DESIGN.colors.neutral[900]
    },
    error: {
      border: `2px solid ${DESIGN.colors.danger[300]}`,
      focusBorder: `2px solid ${DESIGN.colors.danger[600]}`,
      bg: DESIGN.colors.danger[50],
      focusBg: 'white',
      text: DESIGN.colors.neutral[900]
    }
  };

  const variantStyle = variantStyles[variant] || variantStyles.primary;

  const borderColor = error ? variantStyles.error.border : variantStyle.border;
  const focusBorderColor = error ? variantStyles.error.focusBorder : variantStyle.focusBorder;
  const bgColor = error ? variantStyles.error.bg : variantStyle.bg;
  const focusBgColor = error ? variantStyles.error.focusBg : variantStyle.focusBg;

  return (
    <div style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: DESIGN.typography.sizes.sm,
            fontWeight: '600',
            marginBottom: `${DESIGN.spacing.xs}px`,
            color: DESIGN.colors.neutral[700]
          }}
        >
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%',
          padding: `${DESIGN.spacing.md}px ${DESIGN.spacing.lg}px`,
          borderRadius: DESIGN.border.radius.md,
          border: borderColor,
          backgroundColor: bgColor,
          color: variantStyle.text,
          fontSize: DESIGN.typography.sizes.base,
          fontFamily: DESIGN.typography.family,
          transition: `all ${DESIGN.transition.base}`,
          outline: 'none',
          boxSizing: 'border-box',
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
          ...(!disabled && {
            ':focus': {
              borderColor: focusBorderColor,
              backgroundColor: focusBgColor,
              boxShadow: `0 0 0 3px ${DESIGN.colors.primary[100]}`
            }
          })
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.borderColor = focusBorderColor;
            e.target.style.backgroundColor = focusBgColor;
            e.target.style.boxShadow = `0 0 0 3px ${DESIGN.colors.primary[100]}`;
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = borderColor;
          e.target.style.backgroundColor = bgColor;
          e.target.style.boxShadow = 'none';
        }}
        className={className}
        {...otherProps}
      />

      {/* Error message */}
      {error && (
        <p
          style={{
            marginTop: `${DESIGN.spacing.xs}px`,
            fontSize: DESIGN.typography.sizes.sm,
            color: DESIGN.colors.danger[600],
            fontWeight: '500'
          }}
        >
          ⚠️ {error}
        </p>
      )}

      {/* Helper text */}
      {hint && !error && (
        <p
          style={{
            marginTop: `${DESIGN.spacing.xs}px`,
            fontSize: DESIGN.typography.sizes.xs,
            color: DESIGN.colors.neutral[500]
          }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

/**
 * Component: TextArea
 * Reusable textarea field with design system styling
 */
export function TextArea({
  value = '',
  onChange,
  placeholder = '',
  label = '',
  variant = 'primary',
  fullWidth = true,
  disabled = false,
  error = '',
  hint = '',
  rows = 4,
  className = '',
  ...otherProps
}) {
  const variantStyles = {
    primary: {
      border: `2px solid ${DESIGN.colors.primary[300]}`,
      focusBorder: `2px solid ${DESIGN.colors.primary[600]}`,
      bg: DESIGN.colors.neutral[50],
      focusBg: 'white',
      text: DESIGN.colors.neutral[900]
    },
    success: {
      border: `2px solid ${DESIGN.colors.success[300]}`,
      focusBorder: `2px solid ${DESIGN.colors.success[600]}`,
      bg: DESIGN.colors.success[50],
      focusBg: 'white',
      text: DESIGN.colors.neutral[900]
    },
    warning: {
      border: `2px solid ${DESIGN.colors.warning[300]}`,
      focusBorder: `2px solid ${DESIGN.colors.warning[600]}`,
      bg: DESIGN.colors.warning[50],
      focusBg: 'white',
      text: DESIGN.colors.neutral[900]
    },
    error: {
      border: `2px solid ${DESIGN.colors.danger[300]}`,
      focusBorder: `2px solid ${DESIGN.colors.danger[600]}`,
      bg: DESIGN.colors.danger[50],
      focusBg: 'white',
      text: DESIGN.colors.neutral[900]
    }
  };

  const variantStyle = variantStyles[variant] || variantStyles.primary;
  const borderColor = error ? variantStyles.error.border : variantStyle.border;
  const focusBorderColor = error ? variantStyles.error.focusBorder : variantStyle.focusBorder;
  const bgColor = error ? variantStyles.error.bg : variantStyle.bg;
  const focusBgColor = error ? variantStyles.error.focusBg : variantStyle.focusBg;

  return (
    <div style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: DESIGN.typography.sizes.sm,
            fontWeight: '600',
            marginBottom: `${DESIGN.spacing.xs}px`,
            color: DESIGN.colors.neutral[700]
          }}
        >
          {label}
        </label>
      )}

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        style={{
          width: '100%',
          padding: `${DESIGN.spacing.md}px ${DESIGN.spacing.lg}px`,
          borderRadius: DESIGN.border.radius.md,
          border: borderColor,
          backgroundColor: bgColor,
          color: variantStyle.text,
          fontSize: DESIGN.typography.sizes.base,
          fontFamily: DESIGN.typography.family,
          transition: `all ${DESIGN.transition.base}`,
          outline: 'none',
          boxSizing: 'border-box',
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
          resize: 'vertical',
          fontWeight: '500'
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.borderColor = focusBorderColor;
            e.target.style.backgroundColor = focusBgColor;
            e.target.style.boxShadow = `0 0 0 3px ${DESIGN.colors.primary[100]}`;
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = borderColor;
          e.target.style.backgroundColor = bgColor;
          e.target.style.boxShadow = 'none';
        }}
        className={className}
        {...otherProps}
      />

      {/* Error message */}
      {error && (
        <p
          style={{
            marginTop: `${DESIGN.spacing.xs}px`,
            fontSize: DESIGN.typography.sizes.sm,
            color: DESIGN.colors.danger[600],
            fontWeight: '500'
          }}
        >
          ⚠️ {error}
        </p>
      )}

      {/* Helper text */}
      {hint && !error && (
        <p
          style={{
            marginTop: `${DESIGN.spacing.xs}px`,
            fontSize: DESIGN.typography.sizes.xs,
            color: DESIGN.colors.neutral[500]
          }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

/**
 * Component: Select
 * Reusable select dropdown with design system styling
 */
export function Select({
  value = '',
  onChange,
  options = [],
  placeholder = 'Selecione...',
  label = '',
  disabled = false,
  error = '',
  fullWidth = true,
  className = '',
  ...otherProps
}) {
  const borderColor = error
    ? `2px solid ${DESIGN.colors.danger[300]}`
    : `2px solid ${DESIGN.colors.primary[300]}`;

  const focusBorderColor = error
    ? `2px solid ${DESIGN.colors.danger[600]}`
    : `2px solid ${DESIGN.colors.primary[600]}`;

  const bgColor = error ? DESIGN.colors.danger[50] : DESIGN.colors.neutral[50];

  return (
    <div style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: DESIGN.typography.sizes.sm,
            fontWeight: '600',
            marginBottom: `${DESIGN.spacing.xs}px`,
            color: DESIGN.colors.neutral[700]
          }}
        >
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: '100%',
          padding: `${DESIGN.spacing.md}px ${DESIGN.spacing.lg}px`,
          borderRadius: DESIGN.border.radius.md,
          border: borderColor,
          backgroundColor: bgColor,
          color: DESIGN.colors.neutral[900],
          fontSize: DESIGN.typography.sizes.base,
          fontFamily: DESIGN.typography.family,
          transition: `all ${DESIGN.transition.base}`,
          outline: 'none',
          boxSizing: 'border-box',
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: `${DESIGN.spacing.xl}px`
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.borderColor = focusBorderColor;
            e.target.style.boxShadow = `0 0 0 3px ${DESIGN.colors.primary[100]}`;
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = borderColor;
          e.target.style.boxShadow = 'none';
        }}
        className={className}
        {...otherProps}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Error message */}
      {error && (
        <p
          style={{
            marginTop: `${DESIGN.spacing.xs}px`,
            fontSize: DESIGN.typography.sizes.sm,
            color: DESIGN.colors.danger[600],
            fontWeight: '500'
          }}
        >
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}

export default Input;
