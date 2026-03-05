import React, { useState } from 'react';
import DESIGN from '../design-system';

/**
 * Component: Table
 * Professional data table with design system styling
 * 
 * @param {Array} columns - Column definitions: { key, label, align?, sortable?, width?, render? }
 * @param {Array} data - Row data (array of objects)
 * @param {boolean} striped - Alternate row colors (default: true)
 * @param {boolean} hover - Highlight row on hover (default: true)
 * @param {boolean} compact - Reduce padding (default: false)
 * @param {string} variant - 'default', 'primary', 'success', etc.
 * @param {boolean} sortable - Enable column sorting (default: false)
 * @param {function} onRowClick - Handler when row is clicked
 * @param {ReactNode} emptyState - Content to show when no data
 * @param {string} className - Additional CSS classes
 * 
 * @example
 * <Table
 *   columns={[
 *     { key: 'id', label: 'ID', align: 'center', width: '60px' },
 *     { key: 'placa', label: 'Placa' },
 *     { key: 'valor', label: 'Valor', align: 'right' }
 *   ]}
 *   data={veiculos}
 *   onRowClick={(row) => console.log(row)}
 * />
 */
export function Table({
  columns = [],
  data = [],
  striped = true,
  hover = true,
  compact = false,
  variant = 'default',
  sortable = false,
  onRowClick,
  emptyState = <p style={{ textAlign: 'center', color: DESIGN.colors.neutral[500] }}>Nenhum dado disponível</p>,
  className = '',
  ...otherProps
}) {
  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (key) => {
    if (!sortable) return;

    if (sortConfig?.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  // Sort data if needed
  let sortedData = [...data];
  if (sortConfig && sortable) {
    sortedData.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  if (data.length === 0) {
    return (
      <div
        style={{
          padding: `${DESIGN.spacing.lg}px`,
          backgroundColor: DESIGN.colors.neutral[50],
          borderRadius: DESIGN.border.radius.md,
          border: `1px solid ${DESIGN.colors.neutral[200]}`
        }}
        className={className}
      >
        {emptyState}
      </div>
    );
  }

  const paddingSize = compact ? DESIGN.spacing.sm : DESIGN.spacing.md;

  return (
    <div
      style={{
        overflow: 'auto',
        borderRadius: DESIGN.border.radius.md,
        border: `1px solid ${DESIGN.colors.neutral[200]}`,
        boxShadow: DESIGN.shadow.sm
      }}
      className={className}
      {...otherProps}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: DESIGN.typography.family,
          fontSize: DESIGN.typography.sizes.sm
        }}
      >
        {/* Header */}
        <thead>
          <tr
            style={{
              backgroundColor: DESIGN.colors.neutral[100],
              borderBottom: `2px solid ${DESIGN.colors.neutral[200]}`
            }}
          >
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column.key)}
                style={{
                  padding: `${paddingSize}px ${DESIGN.spacing.lg}px`,
                  textAlign: column.align || 'left',
                  fontWeight: '700',
                  color: DESIGN.colors.neutral[900],
                  cursor: column.sortable || sortable ? 'pointer' : 'default',
                  userSelect: 'none',
                  width: column.width,
                  backgroundColor: sortConfig?.key === column.key
                    ? DESIGN.colors.primary[100]
                    : 'transparent',
                  transition: `background-color ${DESIGN.transition.fast}`
                }}
                onMouseEnter={(e) => {
                  if (column.sortable || sortable) {
                    e.target.style.backgroundColor = DESIGN.colors.primary[50];
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = sortConfig?.key === column.key
                    ? DESIGN.colors.primary[100]
                    : 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: `${DESIGN.spacing.xs}px` }}>
                  {column.label}
                  {sortConfig?.key === column.key && (
                    <span style={{ fontSize: '12px', marginLeft: '4px' }}>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              style={{
                backgroundColor: striped && rowIndex % 2 === 1
                  ? DESIGN.colors.neutral[50]
                  : 'white',
                borderBottom: `1px solid ${DESIGN.colors.neutral[200]}`,
                cursor: onRowClick ? 'pointer' : 'default',
                transition: `background-color ${DESIGN.transition.fast}`,
                ':hover': hover ? {
                  backgroundColor: DESIGN.colors.primary[50]
                } : {}
              }}
              onMouseEnter={(e) => {
                if (hover) {
                  e.currentTarget.style.backgroundColor = DESIGN.colors.primary[50];
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = striped && rowIndex % 2 === 1
                  ? DESIGN.colors.neutral[50]
                  : 'white';
              }}
            >
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column.key}`}
                  style={{
                    padding: `${paddingSize}px ${DESIGN.spacing.lg}px`,
                    textAlign: column.align || 'left',
                    color: DESIGN.colors.neutral[900],
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Component: DataGrid
 * Advanced table with pagination and filtering
 */
export function DataGrid({
  columns = [],
  data = [],
  pageSize = 10,
  onRowClick,
  variant = 'default',
  ...otherProps
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data
  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  // Paginate data
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${DESIGN.spacing.md}px`
      }}
      {...otherProps}
    >
      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Buscar..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        style={{
          padding: `${DESIGN.spacing.sm}px ${DESIGN.spacing.md}px`,
          borderRadius: DESIGN.border.radius.md,
          border: `1px solid ${DESIGN.colors.neutral[300]}`,
          fontSize: DESIGN.typography.sizes.sm,
          width: '100%',
          boxSizing: 'border-box'
        }}
      />

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedData}
        onRowClick={onRowClick}
        variant={variant}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${DESIGN.spacing.md}px`,
            backgroundColor: DESIGN.colors.neutral[50],
            borderRadius: DESIGN.border.radius.md,
            fontSize: DESIGN.typography.sizes.sm
          }}
        >
          <p style={{ margin: 0, color: DESIGN.colors.neutral[600] }}>
            Página {currentPage} de {totalPages} ({filteredData.length} resultados)
          </p>

          <div style={{ display: 'flex', gap: `${DESIGN.spacing.sm}px` }}>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                padding: `${DESIGN.spacing.sm}px ${DESIGN.spacing.md}px`,
                borderRadius: DESIGN.border.radius.sm,
                border: `1px solid ${DESIGN.colors.neutral[300]}`,
                backgroundColor: 'white',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1,
                transition: `all ${DESIGN.transition.fast}`
              }}
            >
              ← Anterior
            </button>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: `${DESIGN.spacing.sm}px ${DESIGN.spacing.md}px`,
                borderRadius: DESIGN.border.radius.sm,
                border: `1px solid ${DESIGN.colors.neutral[300]}`,
                backgroundColor: 'white',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1,
                transition: `all ${DESIGN.transition.fast}`
              }}
            >
              Próxima →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
