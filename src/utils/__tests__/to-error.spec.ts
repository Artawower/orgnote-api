import { describe, it, expect } from 'vitest';
import { to } from '../to-error';
import { ok } from 'neverthrow';

describe('to-error utility', () => {
  describe('synchronous functions', () => {
    it('should return Ok(result) when function succeeds', () => {
      const fn = () => 42;
      const wrapped = to(fn);
      const result = wrapped();
      expect(result).toEqual(ok(42));
    });

    it('should return Err(Error) when function throws', () => {
      const fn = (): number => {
        throw new Error('boom');
      };
      const wrapped = to(fn);
      const result = wrapped();
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('boom');
      }
    });

    it('should use custom error mapper function', () => {
      const fn = (): number => {
        throw new Error('boom');
      };
      const mapper = (e: unknown) =>
        new Error(`Custom: ${e instanceof Error ? e.message : e}`);
      const wrapped = to(fn, mapper);

      const result = wrapped();

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toBe('Custom: boom');
      }
    });

    it('should wrap error with message when string is provided', () => {
      const fn = (): number => {
        throw new Error('original error');
      };
      const wrapped = to(fn, 'Context message');

      const result = wrapped();

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toBe('Context message');
        expect(result.error.cause).toBeInstanceOf(Error);
        expect((result.error.cause as Error).message).toBe('original error');
      }
    });
  });

  describe('asynchronous functions', () => {
    it('should return Ok(result) when promise resolves', async () => {
      const fn = async () => 42;
      const wrapped = to(fn);
      const result = await wrapped();
      expect(result).toEqual(ok(42));
    });

    it('should return Err(Error) when promise rejects', async () => {
      const fn = async () => {
        throw new Error('async boom');
      };
      const wrapped = to(fn);
      const result = await wrapped();
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toBe('async boom');
      }
    });

    it('should map async errors', async () => {
      const fn = async () => {
        throw new Error('async boom');
      };
      const mapper = () => new Error('mapped async error');
      const wrapped = to(fn, mapper);

      const result = await wrapped();

      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toBe('mapped async error');
      }
    });
  });

  describe('argument passing', () => {
    it('should pass arguments to the original function', () => {
      const fn = (a: number, b: number) => a + b;
      const wrapped = to(fn);
      const result = wrapped(2, 3);
      expect(result).toEqual(ok(5));
    });

    it('should pass arguments to async function', async () => {
      const fn = async (a: string) => `Hello ${a}`;
      const wrapped = to(fn);
      const result = await wrapped('World');
      expect(result).toEqual(ok('Hello World'));
    });
  });

  describe('context binding', () => {
    it('should preserve this context', () => {
      class Calculator {
        constructor(private multiplier: number) {}

        multiply(value: number) {
          return value * this.multiplier;
        }
      }

      const calc = new Calculator(2);
      const wrapped = to(calc.multiply.bind(calc));

      expect(wrapped(3)).toEqual(ok(6));
    });
  });
});
