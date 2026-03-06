 import React, { useState, useEffect } from 'react';
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
  ariaLabel = 'Data table',
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
        aria-label={ariaLabel}
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
                scope="col"
                onClick={() => handleSort(column.key)}
                role={((column.sortable || sortable) && 'button') || undefined}
                aria-sort={
                  sortConfig?.key !== column.key
                    ? 'none'
                    : sortConfig.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                }
                aria-pressed={sortConfig?.key === column.key ? 'true' : 'false'}
                tabIndex={(column.sortable || sortable) ? 0 : -1}
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
                onKeyDown={(e) => {
                  if ((column.sortable || sortable) && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleSort(column.key);
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: `${DESIGN.spacing.xs}px` }}>
                  {column.label}
                  {sortConfig?.key === column.key && (
                    <span style={{ fontSize: '12px', marginLeft: '4px' }} aria-hidden="true">
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
  sortable = false,
  striped = true,
  hover = true,
  emptyState,
  ...otherProps
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [goToPage, setGoToPage] = useState('');

   // Debounce search term (500ms delay)
   useEffect(() => {
     const timer = setTimeout(() => {
       setDebouncedSearchTerm(searchTerm);
     }, 500);
 
     return () => clearTimeout(timer);
   }, [searchTerm]);
 
  // Filter data
  const filteredData = data.filter((row) => {
     if (!debouncedSearchTerm) return true;
    return Object.values(row)
      .join(' ')
      .toLowerCase()
       .includes(debouncedSearchTerm.toLowerCase());
  });

  // Paginate data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);

  // Handle "Go to page" submission
  const handleGoToPage = (newPage) => {
    const pageNum = parseInt(newPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setGoToPage('');
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newSize = parseInt(e.target.value);
    setItemsPerPage(newSize);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${DESIGN.spacing.md}px`
      }}
      {...otherProps}
    >
      {/* Search & Items Per Page */}
      <div
        style={{
          display: 'flex',
          gap: DESIGN.spacing.md,
          alignItems: 'flex-end',
          flexWrap: 'wrap'
        }}
      >
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
            flex: 1,
            minWidth: '200px',
            boxSizing: 'border-box',
            fontFamily: DESIGN.typography.family
          }}
        />

        {/* Items Per Page Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: DESIGN.spacing.sm }}>
          <label style={{ fontSize: DESIGN.typography.sizes.sm, whiteSpace: 'nowrap' }}>
            Itens por página:
          </label>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            style={{
              padding: `${DESIGN.spacing.xs}px ${DESIGN.spacing.sm}px`,
              borderRadius: DESIGN.border.radius.sm,
              border: `1px solid ${DESIGN.colors.neutral[300]}`,
              fontSize: DESIGN.typography.sizes.sm,
              fontFamily: DESIGN.typography.family,
              cursor: 'pointer'
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedData}
        onRowClick={onRowClick}
        variant={variant}
        sortable={sortable}
        striped={striped}
        hover={hover}
        emptyState={emptyState}
      />

      {/* Pagination Controls */}
      {filteredData.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: DESIGN.spacing.md,
            padding: `${DESIGN.spacing.md}px`,
            backgroundColor: DESIGN.colors.neutral[50],
            borderRadius: DESIGN.border.radius.md,
            border: `1px solid ${DESIGN.colors.neutral[200]}`
          }}
        >
          {/* Info Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: DESIGN.spacing.sm
            }}
          >
            <p style={{ margin: 0, color: DESIGN.colors.neutral[700], fontSize: DESIGN.typography.sizes.sm, fontWeight: '500' }}>
              {filteredData.length === 1
                ? '1 resultado'
                : `${filteredData.length} resultados`} |
              Mostrando {startIndex + 1}-{endIndex} de {filteredData.length}
            </p>
            <p style={{ margin: 0, color: DESIGN.colors.neutral[600], fontSize: DESIGN.typography.sizes.sm }}>
              {totalPages === 1 ? 'Página 1' : `Página ${currentPage} de ${totalPages}`}
            </p>
          </div>

          {/* Navigation Controls */}
          <div
            style={{
              display: 'flex',
              gap: DESIGN.spacing.md,
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                padding: `${DESIGN.spacing.sm}px ${DESIGN.spacing.md}px`,
                borderRadius: DESIGN.border.radius.sm,
                border: `1px solid ${DESIGN.colors.neutral[300]}`,
                backgroundColor: currentPage === 1 ? DESIGN.colors.neutral[100] : 'white',
                color: currentPage === 1 ? DESIGN.colors.neutral[400] : DESIGN.colors.neutral[900],
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.6 : 1,
                transition: `all ${DESIGN.transition.fast}`,
                fontSize: DESIGN.typography.sizes.sm,
                fontWeight: '500',
                fontFamily: DESIGN.typography.family
              }}
              onMouseEnter={(e) => {
                if (currentPage > 1) {
                  e.target.style.backgroundColor = DESIGN.colors.primary[50];
                  e.target.style.borderColor = DESIGN.colors.primary[300];
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = DESIGN.colors.neutral[300];
              }}
            >
              ← Anterior
            </button>

            {/* Page Numbers */}
            <div style={{ display: 'flex', gap: DESIGN.spacing.xs, flexWrap: 'wrap' }}>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      minWidth: '36px',
                      padding: `${DESIGN.spacing.xs}px ${DESIGN.spacing.sm}px`,
                      borderRadius: DESIGN.border.radius.sm,
                      border: currentPage === pageNum ? `2px solid ${DESIGN.colors.primary[500]}` : `1px solid ${DESIGN.colors.neutral[300]}`,
                      backgroundColor: currentPage === pageNum ? DESIGN.colors.primary[100] : 'white',
                      color: currentPage === pageNum ? DESIGN.colors.primary[700] : DESIGN.colors.neutral[900],
                      cursor: 'pointer',
                      transition: `all ${DESIGN.transition.fast}`,
                      fontSize: DESIGN.typography.sizes.sm,
                      fontWeight: currentPage === pageNum ? '700' : '500',
                      fontFamily: DESIGN.typography.family
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== pageNum) {
                        e.target.style.backgroundColor = DESIGN.colors.neutral[100];
                        e.target.style.borderColor = DESIGN.colors.neutral[400];
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = currentPage === pageNum ? DESIGN.colors.primary[100] : 'white';
                      e.target.style.borderColor = currentPage === pageNum ? DESIGN.colors.primary[500] : DESIGN.colors.neutral[300];
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span style={{ color: DESIGN.colors.neutral[500], padding: `${DESIGN.spacing.xs}px` }}>...</span>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: `${DESIGN.spacing.sm}px ${DESIGN.spacing.md}px`,
                borderRadius: DESIGN.border.radius.sm,
                border: `1px solid ${DESIGN.colors.neutral[300]}`,
                backgroundColor: currentPage === totalPages ? DESIGN.colors.neutral[100] : 'white',
                color: currentPage === totalPages ? DESIGN.colors.neutral[400] : DESIGN.colors.neutral[900],
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.6 : 1,
                transition: `all ${DESIGN.transition.fast}`,
                fontSize: DESIGN.typography.sizes.sm,
                fontWeight: '500',
                fontFamily: DESIGN.typography.family
              }}
              onMouseEnter={(e) => {
                if (currentPage < totalPages) {
                  e.target.style.backgroundColor = DESIGN.colors.primary[50];
                  e.target.style.borderColor = DESIGN.colors.primary[300];
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = DESIGN.colors.neutral[300];
              }}
            >
              Próxima →
            </button>

            {/* Go To Page */}
            <div style={{ display: 'flex', gap: DESIGN.spacing.xs, alignItems: 'center', marginLeft: 'auto' }}>
              <label style={{ fontSize: DESIGN.typography.sizes.sm, whiteSpace: 'nowrap' }}>
                Ir para:
              </label>
              <input
                type="number"
                min="1"
                max={totalPages}
                placeholder="Page"
                value={goToPage}
                onChange={(e) => setGoToPage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleGoToPage(goToPage);
                  }
                }}
                style={{
                  width: '50px',
                  padding: `${DESIGN.spacing.xs}px ${DESIGN.spacing.sm}px`,
                  borderRadius: DESIGN.border.radius.sm,
                  border: `1px solid ${DESIGN.colors.neutral[300]}`,
                  fontSize: DESIGN.typography.sizes.sm,
                  fontFamily: DESIGN.typography.family
                }}
              />
              <button
                onClick={() => handleGoToPage(goToPage)}
                style={{
                  padding: `${DESIGN.spacing.xs}px ${DESIGN.spacing.sm}px`,
                  borderRadius: DESIGN.border.radius.sm,
                  border: `1px solid ${DESIGN.colors.primary[300]}`,
                  backgroundColor: DESIGN.colors.primary[500],
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: DESIGN.typography.sizes.sm,
                  fontWeight: '500',
                  fontFamily: DESIGN.typography.family,
                  transition: `all ${DESIGN.transition.fast}`
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = DESIGN.colors.primary[600];
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = DESIGN.colors.primary[500];
                }}
              >
                ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
