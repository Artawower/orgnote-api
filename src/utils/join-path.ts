export function join(...path: string[]): string {
  return path
    .filter((p) => p !== '/' && p)
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/\/+$/, '');
}
