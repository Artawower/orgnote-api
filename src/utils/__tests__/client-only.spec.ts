import { test, expect, vi } from 'vitest';
import { clientOnly } from '../client-only';

test('returns an empty function if fn is not provided', () => {
  const result = clientOnly();
  expect(result).toBeInstanceOf(Function);
  expect(result()).toBeUndefined();
});

test('calls the provided function when CLIENT=true', () => {
  process.env.CLIENT = 'true';
  const mockFn = vi.fn((x: number) => x + 1);
  const result = clientOnly(mockFn);

  const output = result(1);
  expect(mockFn).toHaveBeenCalledWith(1);
  expect(output).toBe(2);
});

test('returns the default value when CLIENT=false', () => {
  process.env.CLIENT = '';
  const mockFn = vi.fn((x: number) => x + 1);
  const defaultValue = 42;
  const result = clientOnly(mockFn, defaultValue);

  const output = result(1);
  console.log('✎: [line 27][client-only.spec.ts] output: ', output);
  expect(mockFn).not.toHaveBeenCalled();
  expect(output).toBe(defaultValue);
});

test('returns undefined on the server without a default value', () => {
  process.env.CLIENT = '';
  const mockFn = vi.fn((x: number) => x + 1);
  const result = clientOnly(mockFn);

  const output = result(1);
  expect(mockFn).not.toHaveBeenCalled();
  expect(output).toBeUndefined();
});

test('passes arguments to the provided function correctly', () => {
  process.env.CLIENT = 'true';
  const mockFn = vi.fn((x: number, y: number) => x + y);
  const result = clientOnly(mockFn);

  const output = result(3, 4);
  expect(mockFn).toHaveBeenCalledWith(3, 4);
  expect(output).toBe(7);
});
