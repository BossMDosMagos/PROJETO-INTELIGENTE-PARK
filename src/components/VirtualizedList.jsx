import React, { useMemo, useState } from 'react';
import DESIGN from '../design-system';

export function VirtualizedList({
  items = [],
  itemHeight = 56,
  height = 520,
  overscan = 6,
  keyExtractor,
  renderItem,
  emptyState,
  className = '',
  style,
  ...otherProps
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(height / itemHeight);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2);

  const visibleItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex]
  );

  if (!items.length) {
    return (
      <div
        className={className}
        style={{
          borderRadius: DESIGN.border.radius.md,
          border: `1px solid ${DESIGN.colors.neutral[200]}`,
          backgroundColor: DESIGN.colors.neutral[50],
          padding: DESIGN.spacing.lg
        }}
      >
        {emptyState || (
          <p style={{ textAlign: 'center', color: DESIGN.colors.neutral[500], margin: 0 }}>
            Nenhum item disponível
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={className}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      style={{
        position: 'relative',
        height,
        overflowY: 'auto',
        overflowX: 'hidden',
        borderRadius: DESIGN.border.radius.md,
        border: `1px solid ${DESIGN.colors.neutral[200]}`,
        backgroundColor: DESIGN.colors.white,
        ...style
      }}
      {...otherProps}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, visibleIndex) => {
          const absoluteIndex = startIndex + visibleIndex;
          const top = absoluteIndex * itemHeight;
          const key = keyExtractor ? keyExtractor(item, absoluteIndex) : absoluteIndex;

          return (
            <div
              key={key}
              style={{
                position: 'absolute',
                top,
                left: 0,
                right: 0,
                height: itemHeight,
                display: 'flex',
                alignItems: 'center',
                borderBottom: `1px solid ${DESIGN.colors.neutral[200]}`,
                backgroundColor: absoluteIndex % 2 === 0 ? DESIGN.colors.white : DESIGN.colors.neutral[50],
                padding: `0 ${DESIGN.spacing.md}px`
              }}
            >
              {renderItem(item, absoluteIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VirtualizedList;
