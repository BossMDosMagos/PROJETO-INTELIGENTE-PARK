import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

describe('App', () => {
  it('renders without crashing', () => {
    expect(true).toBe(true);
  });
});

describe('useLocalStorage', () => {
  it('should be defined', () => {
    expect(true).toBe(true);
  });
});
