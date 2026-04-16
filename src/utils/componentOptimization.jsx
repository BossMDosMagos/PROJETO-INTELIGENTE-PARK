/**
 * Component Optimization Utilities
 * - useMemo helpers for complex calculations
 * - useCallback wrappers for handlers
 * - Lazy loading component factories
 */

import React, { useMemo, useCallback, useRef, useEffect } from 'react';

/**
 * useMemoWithDependencies
 * Memoize expensive calculations with smart re-compute checks
 */
export const useMemoCompute = (computeFn, dependencies = [], debug = false) => {
  return useMemo(() => {
    if (debug) console.time('useMemoCompute');
    const result = computeFn();
    if (debug) console.timeEnd('useMemoCompute');
    return result;
  }, dependencies);
};

/**
 * useCallbackWithRef
 * Stable callback ref that doesn't trigger re-renders
 */
export const useStableCallback = (callback) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args) => {
    return callbackRef.current(...args);
  }, []);
};

/**
 * useAsyncMemo
 * Memoize async operations (data fetching, computations)
 */
export const useAsyncMemo = (asyncFn, dependencies = []) => {
  const [state, setState] = React.useState({
    loading: true,
    data: null,
    error: null
  });

  React.useEffect(() => {
    let isMounted = true;

    const loadAsync = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        const data = await asyncFn();
        if (isMounted) {
          setState({ loading: false, data, error: null });
        }
      } catch (error) {
        if (isMounted) {
          setState({ loading: false, data: null, error });
        }
      }
    };

    loadAsync();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return state;
};

/**
 * withPerformanceMonitoring
 * HOC para medir performance de componentes
 */
export const withPerformanceMonitoring = (Component, componentName = 'Component') => {
  return React.memo((props) => {
    const renderStartRef = useRef(Date.now());

    useEffect(() => {
      const renderEnd = Date.now();
      const renderTime = renderEnd - renderStartRef.current;

      if (process.env.NODE_ENV === 'development' && renderTime > 100) {
        console.warn(
          `⚠️ ${componentName} renderou em ${renderTime}ms (> 100ms)`,
          { props }
        );
      }
    });

    return <Component {...props} />;
  });
};

/**
 * createMemoComponentWithCallback
 * Create memoized component that accepts callbacks
 */
export const createMemoComponent = (Component, displayName = 'Component') => {
  const Memoized = React.memo(Component);
  Memoized.displayName = displayName;
  return Memoized;
};

/**
 * useDataTransformMemo
 * Memoize data transformations commonly used in tables/grids
 */
export const useDataTransformMemo = (data, transformFn) => {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(transformFn);
  }, [data, transformFn]);
};

/**
 * useTableDataMemo
 * Optimize common table operations: sort, filter, paginate
 */
export const useTableDataMemo = (data, { sortBy, filterFn, pageSize, currentPage } = {}) => {
  return useMemo(() => {
    let result = [...(Array.isArray(data) ? data : [])];

    // Apply filter
    if (filterFn) {
      result = result.filter(filterFn);
    }

    // Apply sort
    if (sortBy) {
      result.sort((a, b) => {
        const aVal = a[sortBy.key];
        const bVal = b[sortBy.key];

        if (typeof aVal === 'string') {
          return sortBy.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return sortBy.direction === 'asc'
          ? aVal - bVal
          : bVal - aVal;
      });
    }

    // Apply pagination
    if (pageSize && currentPage) {
      const startIdx = (currentPage - 1) * pageSize;
      const endIdx = startIdx + pageSize;
      return {
        data: result.slice(startIdx, endIdx),
        total: result.length,
        pages: Math.ceil(result.length / pageSize)
      };
    }

    return { data: result, total: result.length, pages: 1 };
  }, [data, sortBy, filterFn, pageSize, currentPage]);
};

/**
 * useListVirtualization
 * Virtual list optimization for large lists
 * Returns items to render based on scroll position
 */
export const useListVirtualization = (items = [], itemHeight = 50, containerHeight = 500) => {
  const [scrollTop, setScrollTop] = React.useState(0);

  // Number of visible items at a time
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 5; // +5 buffer

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2);
  const endIndex = Math.min(items.length, startIndex + visibleCount);

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    startIndex,
    endIndex,
    offsetY,
    onScroll: (e) => setScrollTop(e.currentTarget.scrollTop),
    totalHeight: items.length * itemHeight
  };
};

/**
 * useFormFieldsMemo
 * Memoize form field definitions and handlers
 */
export const useFormFieldsMemo = (initialValues, onValueChange) => {
  const fieldsRef = useRef(initialValues);
  const handlersRef = useRef({});

  const createFieldHandler = useCallback((fieldName) => {
    return (value) => {
      fieldsRef.current[fieldName] = value;
      onValueChange(fieldName, value);
    };
  }, [onValueChange]);

  return {
    getField: (fieldName) => fieldsRef.current[fieldName],
    setField: createFieldHandler,
    getHandler: (fieldName) => {
      if (!handlersRef.current[fieldName]) {
        handlersRef.current[fieldName] = createFieldHandler(fieldName);
      }
      return handlersRef.current[fieldName];
    }
  };
};

/**
 * useValueDebounce
 * Debounced memo of a value
 */
export const useValueDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * usePrevious
 * Remember previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
