export function join(...path: string[]): string {
  return path.join('/').replace(/\/+/g, '/').replace(/\/+$/, '');
}
