import { parse, stringify } from 'smol-toml';
import { BaseSchema, safeParse, InferOutput } from 'valibot';

export function parseToml<
  T = unknown,
  S extends BaseSchema<unknown, unknown, any> | undefined = undefined,
>(
  content: string,
  schema?: S
): S extends BaseSchema<unknown, unknown, any> ? InferOutput<S> : T {
  type Result = S extends BaseSchema<unknown, unknown, any> ? InferOutput<S> : T;

  try {
    const res = parse(content);

    if (!schema) {
      return res as Result;
    }

    const validationResult = safeParse(schema, res);

    if (validationResult.success) {
      return validationResult.output as Result;
    }

    throw new TypeError('Invalid config format', {
      cause: validationResult.issues,
    });
  } catch (e) {
    if (e instanceof TypeError) {
      throw e;
    }
    throw new SyntaxError('Invalid TOML format', { cause: e });
  }
}

export function stringifyToml(data: unknown): string {
  try {
    return stringify(data);
  } catch (e) {
    throw new Error('Failed to stringify TOML', { cause: e });
  }
}
