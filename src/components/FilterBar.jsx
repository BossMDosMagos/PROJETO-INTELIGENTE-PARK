import React, { useState, memo } from 'react';
import DESIGN from '../design-system';
import { X } from 'lucide-react';

/**
 * Component: FilterBar
 * Dynamic filters for tables and datagrids
 * 
 * @param {Array} filters - Filter configurations
 * @param {Array} appliedFilters - Current applied filters
 * @param {function} onFilterChange - Called when filters change
 * @param {function} onClearAll - Called when all filters cleared
 * 
 * @example
 * <FilterBar
 *   filters={[
 *     { key: 'tipo', label: 'Tipo', type: 'select', options: [...] },
 *     { key: 'status', label: 'Status', type: 'select', options: [...] },
 *     { key: 'dataInicio', label: 'Data Início', type: 'date' }
 *   ]}
 *   appliedFilters={{ tipo: 'carro', status: 'ativo' }}
 *   onFilterChange={(filters) => {...}}
 * />
 */
export function FilterBar({
  filters = [],
  appliedFilters = {},
  onFilterChange = () => {},
  onClearAll = () => {},
  showBadge = true
}) {
  const [expandedFilters, setExpandedFilters] = useState(false);
  const activeFilterCount = Object.keys(appliedFilters).filter(k => appliedFilters[k]).length;

  const handleFilterChange = (key, value) => {
    const newFilters = { ...appliedFilters };
    if (value === null || value === '' || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    onFilterChange(newFilters);
  };

  const handleClearAll = () => {
    onClearAll();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: DESIGN.spacing.md,
        padding: DESIGN.spacing.md,
        backgroundColor: DESIGN.colors.neutral[50],
        borderRadius: DESIGN.border.radius.md,
        border: `1px solid ${DESIGN.colors.neutral[200]}`
      }}
    >
      {/* Filter Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: DESIGN.spacing.md
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: DESIGN.spacing.sm
          }}
        >
          <span style={{ fontSize: DESIGN.typography.sizes.sm, fontWeight: '600' }}>
            🔍 Filtros
          </span>
          {showBadge && activeFilterCount > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '24px',
                height: '24px',
                padding: '0 6px',
                backgroundColor: DESIGN.colors.primary[500],
                color: 'white',
                borderRadius: '999px',
                fontSize: DESIGN.typography.sizes.xs,
                fontWeight: '700'
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: DESIGN.spacing.sm }}>
          {activeFilterCount > 0 && (
            <button
              onClick={handleClearAll}
              style={{
                padding: `${DESIGN.spacing.xs}px ${DESIGN.spacing.sm}px`,
                backgroundColor: DESIGN.colors.danger[50],
                color: DESIGN.colors.danger[600],
                border: `1px solid ${DESIGN.colors.danger[300]}`,
                borderRadius: DESIGN.border.radius.sm,
                fontSize: DESIGN.typography.sizes.sm,
                fontWeight: '500',
                cursor: 'pointer',
                transition: `all ${DESIGN.transition.fast}`,
                fontFamily: DESIGN.typography.family
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = DESIGN.colors.danger[100];
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = DESIGN.colors.danger[50];
              }}
            >
              🗑️ Limpar Filtros
            </button>
          )}

          <button
            onClick={() => setExpandedFilters(!expandedFilters)}
            style={{
              padding: `${DESIGN.spacing.xs}px ${DESIGN.spacing.sm}px`,
              backgroundColor: expandedFilters ? DESIGN.colors.primary[100] : 'white',
              color: DESIGN.colors.neutral[900],
              border: `1px solid ${DESIGN.colors.neutral[300]}`,
              borderRadius: DESIGN.border.radius.sm,
              fontSize: DESIGN.typography.sizes.sm,
              fontWeight: '500',
              cursor: 'pointer',
              transition: `all ${DESIGN.transition.fast}`,
              fontFamily: DESIGN.typography.family
            }}
            onMouseEnter={(e) => {
              if (!expandedFilters) {
                e.target.style.backgroundColor = DESIGN.colors.neutral[100];
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = expandedFilters ? DESIGN.colors.primary[100] : 'white';
            }}
          >
            {expandedFilters ? '▲ Recolher' : '▼ Expandir'}
          </button>
        </div>
      </div>

      {/* Active Filters Pills */}
      {activeFilterCount > 0 && (
        <div
          style={{
            display: 'flex',
            gap: DESIGN.spacing.sm,
            flexWrap: 'wrap'
          }}
        >
          {Object.entries(appliedFilters).map(([key, value]) => {
            if (!value) return null;
            const filterConfig = filters.find(f => f.key === key);
            return (
              <div
                key={key}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: DESIGN.spacing.xs,
                  padding: `${DESIGN.spacing.xs}px ${DESIGN.spacing.sm}px`,
                  backgroundColor: DESIGN.colors.primary[100],
                  border: `1px solid ${DESIGN.colors.primary[300]}`,
                  borderRadius: DESIGN.border.radius.md,
                  fontSize: DESIGN.typography.sizes.sm
                }}
              >
                <span style={{ fontWeight: '500' }}>{filterConfig?.label || key}:</span>
                <span style={{ color: DESIGN.colors.primary[700], fontWeight: '600' }}>
                  {value === true ? '✓' : value}
                </span>
                <button
                  onClick={() => handleFilterChange(key, null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '16px',
                    height: '16px',
                    padding: 0,
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: DESIGN.colors.primary[600],
                    transition: `color ${DESIGN.transition.fast}`
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = DESIGN.colors.danger[600];
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = DESIGN.colors.primary[600];
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter Controls */}
      {expandedFilters && filters.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: DESIGN.spacing.md
          }}
        >
          {filters.map((filter) => (
            <div key={filter.key} style={{ display: 'flex', flexDirection: 'column', gap: DESIGN.spacing.xs }}>
              {/* Select Filter */}
              {filter.type === 'select' && (
                <>
                  <label
                    style={{
                      fontSize: DESIGN.typography.sizes.sm,
                      fontWeight: '600',
                      color: DESIGN.colors.neutral[900]
                    }}
                  >
                    {filter.label}
                  </label>
                  <select
                    value={appliedFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value || null)}
                    style={{
                      padding: `${DESIGN.spacing.sm}px ${DESIGN.spacing.md}px`,
                      borderRadius: DESIGN.border.radius.sm,
                      border: `1px solid ${DESIGN.colors.neutral[300]}`,
                      backgroundColor: 'white',
                      fontSize: DESIGN.typography.sizes.sm,
                      fontFamily: DESIGN.typography.family,
                      cursor: 'pointer',
                      color: DESIGN.colors.neutral[900]
                    }}
                  >
                    <option value="">Todos</option>
                    {filter.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {/* Date Filter */}
              {filter.type === 'date' && (
                <>
                  <label
                    style={{
                      fontSize: DESIGN.typography.sizes.sm,
                      fontWeight: '600',
                      color: DESIGN.colors.neutral[900]
                    }}
                  >
                    {filter.label}
                  </label>
                  <input
                    type="date"
                    value={appliedFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value || null)}
                    style={{
                      padding: `${DESIGN.spacing.sm}px ${DESIGN.spacing.md}px`,
                      borderRadius: DESIGN.border.radius.sm,
                      border: `1px solid ${DESIGN.colors.neutral[300]}`,
                      backgroundColor: 'white',
                      fontSize: DESIGN.typography.sizes.sm,
                      fontFamily: DESIGN.typography.family,
                      cursor: 'pointer'
                    }}
                  />
                </>
              )}

              {/* Date Range Filter */}
              {filter.type === 'dateRange' && (
                <>
                  <label
                    style={{
                      fontSize: DESIGN.typography.sizes.sm,
                      fontWeight: '600',
                      color: DESIGN.colors.neutral[900]
                    }}
                  >
                    {filter.label}
                  </label>
                  <div style={{ display: 'flex', gap: DESIGN.spacing.sm }}>
                    <input
                      type="date"
                      placeholder="De"
                      value={appliedFilters[`${filter.key}From`] || ''}
                      onChange={(e) => handleFilterChange(`${filter.key}From`, e.target.value || null)}
                      style={{
                        flex: 1,
                        padding: `${DESIGN.spacing.sm}px ${DESIGN.spacing.md}px`,
                        borderRadius: DESIGN.border.radius.sm,
                        border: `1px solid ${DESIGN.colors.neutral[300]}`,
                        fontSize: DESIGN.typography.sizes.sm
                      }}
                    />
                    <input
                      type="date"
                      placeholder="Até"
                      value={appliedFilters[`${filter.key}To`] || ''}
                      onChange={(e) => handleFilterChange(`${filter.key}To`, e.target.value || null)}
                      style={{
                        flex: 1,
                        padding: `${DESIGN.spacing.sm}px ${DESIGN.spacing.md}px`,
                        borderRadius: DESIGN.border.radius.sm,
                        border: `1px solid ${DESIGN.colors.neutral[300]}`,
                        fontSize: DESIGN.typography.sizes.sm
                      }}
                    />
                  </div>
                </>
              )}

              {/* Text Filter */}
              {filter.type === 'text' && (
                <>
                  <label
                    style={{
                      fontSize: DESIGN.typography.sizes.sm,
                      fontWeight: '600',
                      color: DESIGN.colors.neutral[900]
                    }}
                  >
                    {filter.label}
                  </label>
                  <input
                    type="text"
                    placeholder={filter.placeholder || 'Digite para filtrar...'}
                    value={appliedFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value || null)}
                    style={{
                      padding: `${DESIGN.spacing.sm}px ${DESIGN.spacing.md}px`,
                      borderRadius: DESIGN.border.radius.sm,
                      border: `1px solid ${DESIGN.colors.neutral[300]}`,
                      backgroundColor: 'white',
                      fontSize: DESIGN.typography.sizes.sm,
                      fontFamily: DESIGN.typography.family
                    }}
                  />
                </>
              )}

              {/* Checkbox Filter (Multiple) */}
              {filter.type === 'checkbox' && (
                <>
                  <label
                    style={{
                      fontSize: DESIGN.typography.sizes.sm,
                      fontWeight: '600',
                      color: DESIGN.colors.neutral[900]
                    }}
                  >
                    {filter.label}
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: DESIGN.spacing.xs }}>
                    {filter.options?.map((opt) => (
                      <label
                        key={opt.value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: DESIGN.spacing.sm,
                          cursor: 'pointer',
                          fontSize: DESIGN.typography.sizes.sm
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={
                            Array.isArray(appliedFilters[filter.key])
                              ? appliedFilters[filter.key].includes(opt.value)
                              : false
                          }
                          onChange={(e) => {
                            const currentValues = Array.isArray(appliedFilters[filter.key])
                              ? appliedFilters[filter.key]
                              : [];
                            const newValues = e.target.checked
                              ? [...currentValues, opt.value]
                              : currentValues.filter((v) => v !== opt.value);
                            handleFilterChange(filter.key, newValues.length > 0 ? newValues : null);
                          }}
                          style={{
                            width: '16px',
                            height: '16px',
                            cursor: 'pointer'
                          }}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(FilterBar);
