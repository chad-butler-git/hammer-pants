import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Clean up after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock the fetch API
global.fetch = vi.fn();

// Mock the zustand store
vi.mock('../state/useAppStore', () => ({
  default: vi.fn(() => ({
    items: [],
    stores: [],
    selectedStore: null,
    currentList: null,
    currentRoute: null,
    isLoading: false,
    error: null,
    fetchItems: vi.fn(),
    fetchStores: vi.fn(),
    selectStore: vi.fn(),
    createStore: vi.fn(),
    createShoppingList: vi.fn(),
    addItemToList: vi.fn(),
    removeItemFromList: vi.fn(),
    fetchRoute: vi.fn(),
    completeRouteStep: vi.fn(),
    resetRoute: vi.fn(),
    resetStore: vi.fn(),
  })),
}));

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
    })),
  },
}));