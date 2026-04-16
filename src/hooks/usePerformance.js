import React, { useMemo, useCallback, memo } from 'react';

/**
 * Performance Optimization Utilities
 * Hooks e decoradores para otimização de re-renders
 */

/**
 * Hook: useDebounce
 * Debounce a value with a delay
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook: useThrottle
 * Throttle a callback with a delay
 */
export function useThrottle(callback, delay = 300) {
  const lastCallRef = React.useRef(null);
  const timeoutRef = React.useRef(null);

  return useCallback((...args) => {
    const now = Date.now();

    if (!lastCallRef.current || now - lastCallRef.current >= delay) {
      callback(...args);
      lastCallRef.current = now;
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        lastCallRef.current = Date.now();
      }, delay - (now - lastCallRef.current));
    }
  }, [callback, delay]);
}

/**
 * Hook: useMemoizedCallback
 * Memoize a callback and return it only if dependencies change
 */
export function useMemoizedCallback(callback, dependencies = []) {
  return useCallback(callback, dependencies);
}

/**
 * Hook: useAsyncMemo
 * Memoize async operations
 */
export function useAsyncMemo(asyncFunction, dependencies = []) {
  const [value, setValue] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const result = await asyncFunction();
        if (!cancelled) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setValue(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return { value, loading, error };
}

/**
 * Hook: usePrevious
 * Get previous value of a prop or state
 */
export function usePrevious(value) {
  const ref = React.useRef();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Hook: useIsMounted
 * Track if component is mounted (avoid setState unmounted warning)
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return isMounted;
}

/**
 * Hook: useWindowSize
 * Get window dimensions and update on resize
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  const handleResize = useThrottle(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, 250);

  React.useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return windowSize;
}

/**
 * Hook: useDeviceType
 * Detect device type (mobile, tablet, desktop)
 */
export function useDeviceType() {
  const windowSize = useWindowSize();

  const deviceType = React.useMemo(() => {
    const width = windowSize.width;
    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }, [windowSize.width]);

  return deviceType;
}

/**
 * HOC: withMemo
 * Higher-order component to memoize a component
 */
export function withMemo(Component, areEqual = null) {
  const MemoizedComponent = memo(Component, areEqual);
  MemoizedComponent.displayName = `Memoized(${Component.displayName || Component.name})`;
  return MemoizedComponent;
}

/**
 * HOC: withLazyData
 * Load data asynchronously and show loading state
 */
export function withLazyData(Component, dataFetcher) {
  return function LazyDataComponent(props) {
    const { value: data, loading, error } = useAsyncMemo(
      () => dataFetcher(props),
      [props]
    );

    if (loading) {
      return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>;
    }

    if (error) {
      return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>Erro ao carregar dados</div>;
    }

    return <Component {...props} data={data} />;
  };
}

/**
 * Utility: batchUpdates
 * Batch multiple state updates together
 */
export function batchUpdates(updates) {
  // In React 18+, batching is automatic
  // This is a helper for explicit batch control if needed
  return Promise.all(updates.map(update => {
    return new Promise(resolve => {
      update();
      resolve();
    });
  }));
}

/**
 * Hook: usePaginationMemory
 * Remember pagination state across page navigations
 */
export function usePaginationMemory(key) {
  const [page, setPage] = React.useState(() => {
    const saved = localStorage.getItem(`pagination_${key}`);
    return saved ? parseInt(saved, 10) : 1;
  });

  const updatePage = useCallback((newPage) => {
    setPage(newPage);
    localStorage.setItem(`pagination_${key}`, newPage);
  }, [key]);

  return [page, updatePage];
}

/**
 * Hook: useSearchMemory
 * Remember search terms across navigations
 */
export function useSearchMemory(key, defaultValue = '') {
  const [search, setSearch] = React.useState(() => {
    const saved = localStorage.getItem(`search_${key}`);
    return saved || defaultValue;
  });

  const updateSearch = useCallback((newSearch) => {
    setSearch(newSearch);
    localStorage.setItem(`search_${key}`, newSearch);
  }, [key]);

  const clearSearch = useCallback(() => {
    setSearch(defaultValue);
    localStorage.removeItem(`search_${key}`);
  }, [key, defaultValue]);

  return [search, updateSearch, clearSearch];
}

/**
 * Hook: useLocalStorageState
 * State that persists to localStorage
 */
export function useLocalStorageState(key, defaultValue) {
  const [state, setState] = React.useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  });

  const updateState = useCallback((value) => {
    setState(value);
    localStorage.setItem(key, JSON.stringify(value));
  }, [key]);

  return [state, updateState];
}

/**
 * Hook: useIntersectionObserver
 * Lazy load elements when they come into view
 */
export function useIntersectionObserver(options = {}) {
  const ref = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.1,
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isVisible];
}

/**
 * Component: LazyImage
 * Image that lazy-loads when visible
 */
export const LazyImage = memo(({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3C/svg%3E',
  ...props
}) => {
  const [ref, isVisible] = useIntersectionObserver();
  const [imageSrc, setImageSrc] = React.useState(placeholder);

  React.useEffect(() => {
    if (isVisible) {
      setImageSrc(src);
    }
  }, [isVisible, src]);

  return (
    <img
      ref={ref}
      src={imageSrc}
      alt={alt}
      loading="lazy"
      {...props}
      style={{
        transition: 'opacity 0.3s ease-in-out',
        ...props.style
      }}
    />
  );
});

LazyImage.displayName = 'LazyImage';

/**
 * Utility: preloadImage
 * Preload an image to cache
 */
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Utility: requestIdleCallback with fallback
 * Execute code when browser is idle
 */
export function executeWhenIdle(callback, options = {}) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  // Fallback for older browsers
  return setTimeout(callback, 1000);
}

export default {
  useDebounce,
  useThrottle,
  useMemoizedCallback,
  useAsyncMemo,
  usePrevious,
  useIsMounted,
  useWindowSize,
  useDeviceType,
  withMemo,
  withLazyData,
  batchUpdates,
  usePaginationMemory,
  useSearchMemory,
  useLocalStorageState,
  useIntersectionObserver,
  LazyImage,
  preloadImage,
  executeWhenIdle
};
