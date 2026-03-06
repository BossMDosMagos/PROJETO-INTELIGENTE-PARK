import React, { useState, useRef, useEffect, memo } from 'react';
import DESIGN from '../design-system';
import { Search, X } from 'lucide-react';

/**
 * Component: SearchBar
 * Global search with autocomplete across app data
 * 
 * @param {Array} searchData - Data to search across
 * @param {function} onSelectResult - Called when result is selected
 * @param {string} placeholder - Input placeholder text
 * @param {number} maxResults - Max results to show (default: 10)
 * @param {boolean} autoFocus - Focus input on mount (default: false)
 * 
 * @example
 * <SearchBar 
 *   searchData={veiculos}
 *   onSelectResult={(item) => console.log(item)}
 *   placeholder="Buscar veículos..."
 * />
 */
function SearchBar({
  searchData = [],
  onSelectResult,
  placeholder = 'Buscar...',
  maxResults = 10,
  autoFocus = false
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  // Search algorithm
  const performSearch = (searchTerm) => {
    if (searchTerm.length === 0) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const term = searchTerm.toLowerCase();
    
    // Flatten all searchable fields
    const searchResults = searchData
      .map((item) => {
        let score = 0;
        let matchedFields = [];

        // Search across all string fields
        Object.entries(item).forEach(([key, value]) => {
          if (typeof value === 'string') {
            const val = value.toLowerCase();
            
            // Exact match gets highest score
            if (val === term) {
              score += 100;
              matchedFields.push(key);
            }
            // Starts with gets high score
            else if (val.startsWith(term)) {
              score += 50;
              matchedFields.push(key);
            }
            // Contains gets lower score
            else if (val.includes(term)) {
              score += 10;
              matchedFields.push(key);
            }
          }
        });

        return { ...item, score, matchedFields };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    setResults(searchResults);
    setSelectedIndex(-1);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
    setShowResults(value.length > 0);
  };

  const handleSelectResult = (result) => {
    onSelectResult?.(result);
    setQuery('');
    setResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelectResult(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowResults(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (resultsRef.current && !resultsRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      selectedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '400px'
      }}
    >
      {/* Input Container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: DESIGN.spacing.xs,
          padding: `${DESIGN.spacing.sm}px ${DESIGN.spacing.md}px`,
          backgroundColor: DESIGN.colors.neutral[50],
          border: `1px solid ${DESIGN.colors.neutral[300]}`,
          borderRadius: DESIGN.border.radius.md,
          transition: `all ${DESIGN.transition.fast}`,
          boxShadow: showResults ? DESIGN.shadow.md : 'none'
        }}
        onFocus={() => query.length > 0 && setShowResults(true)}
      >
        <Search
          className="w-5 h-5"
          style={{ color: DESIGN.colors.neutral[400], flexShrink: 0 }}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setShowResults(true)}
          autoFocus={autoFocus}
          aria-label="Buscar"
          aria-autocomplete="list"
          aria-expanded={showResults}
          aria-controls="search-results-listbox"
          aria-describedby={results.length > 0 ? 'search-results-count' : undefined}
          style={{
            flex: 1,
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: DESIGN.typography.sizes.sm,
            fontFamily: DESIGN.typography.family,
            outline: 'none',
            color: DESIGN.colors.neutral[900]
          }}
        />
        {query && (
          <button
            onClick={handleClear}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: DESIGN.colors.neutral[400],
              transition: `color ${DESIGN.transition.fast}`
            }}
            onMouseEnter={(e) => {
              e.target.style.color = DESIGN.colors.neutral[600];
            }}
            onMouseLeave={(e) => {
              e.target.style.color = DESIGN.colors.neutral[400];
            }}
            aria-label="Limpar busca"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          id="search-results-listbox"
          role="listbox"
          aria-label={`${results.length} resultado(s) encontrado(s)`}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: DESIGN.spacing.xs,
            backgroundColor: 'white',
            border: `1px solid ${DESIGN.colors.neutral[200]}`,
            borderRadius: DESIGN.border.radius.md,
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 50,
            boxShadow: DESIGN.shadow.lg
          }}
        >
          <div
            id="search-results-count"
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {results.length} resultado(s) disponível(is)
          </div>
          {results.map((result, index) => (
            <div
              key={`${result.id || index}`}
              onClick={() => handleSelectResult(result)}
              style={{
                padding: `${DESIGN.spacing.md}px`,
                borderBottom: index < results.length - 1 ? `1px solid ${DESIGN.colors.neutral[100]}` : 'none',
                cursor: 'pointer',
                backgroundColor: selectedIndex === index ? DESIGN.colors.primary[50] : 'white',
                transition: `background-color ${DESIGN.transition.fast}`
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              role="option"
              aria-selected={selectedIndex === index}
            >
              {/* Primary label (usually 'placa', 'nome', 'titulo') */}
              <div
                style={{
                  fontWeight: '600',
                  color: DESIGN.colors.neutral[900],
                  marginBottom: DESIGN.spacing.xs
                }}
              >
                {result.placa || result.nomeCompleto || result.nome || result.titulo || 'Item'}
              </div>

              {/* Secondary info */}
              <div
                style={{
                  fontSize: DESIGN.typography.sizes.xs,
                  color: DESIGN.colors.neutral[600],
                  display: 'flex',
                  gap: DESIGN.spacing.sm,
                  flexWrap: 'wrap'
                }}
              >
                {result.modelo && <span>🚗 {result.modelo}</span>}
                {result.email && <span>📧 {result.email}</span>}
                {result.endereco && <span>📍 {result.endereco}</span>}
                {result.status && <span>🏷️ {result.status}</span>}
              </div>

              {/* Matched fields indicator */}
              {result.matchedFields && result.matchedFields.length > 0 && (
                <div
                  style={{
                    fontSize: DESIGN.typography.sizes.xs,
                    color: DESIGN.colors.success[600],
                    marginTop: DESIGN.spacing.xs
                  }}
                  aria-hidden="true"
                >
                  ✓ {result.matchedFields.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showResults && query.length > 0 && results.length === 0 && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: DESIGN.spacing.xs,
            padding: `${DESIGN.spacing.md}px`,
            backgroundColor: 'white',
            border: `1px solid ${DESIGN.colors.neutral[200]}`,
            borderRadius: DESIGN.border.radius.md,
            textAlign: 'center',
            color: DESIGN.colors.neutral[500],
            fontSize: DESIGN.typography.sizes.sm,
            zIndex: 50,
            boxShadow: DESIGN.shadow.lg
          }}
        >
          Nenhum resultado encontrado para "{query}"
        </div>
      )}
    </div>
  );
}

export default React.memo(SearchBar);
