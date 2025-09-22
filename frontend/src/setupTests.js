import '@testing-library/jest-dom';

jest.mock('axios', () => {
  const instance = { get: jest.fn(), post: jest.fn(), delete: jest.fn() };
  return { create: jest.fn(() => instance) };
});

// Silence ReactDOMTestUtils.act deprecation warning from React 18 in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('ReactDOMTestUtils.act')) {
      return;
    }
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});


