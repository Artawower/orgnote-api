import type { FileSystem, DiskFile } from '../models/file-system';
import type { LocalFile, SyncStateData } from './types';
import { toAbsolutePath, toRelativePath } from '../utils/to-absolute-path';
import picomatch from 'picomatch';

const DEFAULT_IGNORE_PATTERNS = [
  '.git',
  '.jj',
  '.hg',
  '.svn',
  '.DS_Store',
  'node_modules',
  '.sync-state',
  '.Trash',
];

type IgnoreMatcher = (input: string) => boolean;

const compileMatchers = (patterns: string[]): IgnoreMatcher[] =>
  patterns.map((p) => picomatch(p, { dot: true }));

export async function scanLocalFiles(
  fs: FileSystem,
  rootPath: string,
  ignorePatterns: string[] = []
): Promise<LocalFile[]> {
  const allPatterns = [...DEFAULT_IGNORE_PATTERNS, ...ignorePatterns];
  const matchers = compileMatchers(allPatterns);
  return scanDir(fs, rootPath, matchers);
}

async function scanDir(
  fs: FileSystem,
  dirPath: string,
  matchers: IgnoreMatcher[]
): Promise<LocalFile[]> {
  const entries = await fs.readDir(dirPath);
  const filteredEntries = entries.filter(
    (e) => !shouldIgnore(e.name, toRelativePath(e.path), matchers)
  );

  const nestedResults = await Promise.all(
    filteredEntries.map((entry) => processEntry(fs, entry, matchers))
  );

  return nestedResults.flat();
}

async function processEntry(
  fs: FileSystem,
  entry: DiskFile,
  matchers: IgnoreMatcher[]
): Promise<LocalFile[]> {
  if (entry.type === 'directory') {
    return scanDir(fs, entry.path, matchers);
  }

  return [toLocalFile(entry)];
}

const toLocalFile = (entry: DiskFile): LocalFile => ({
  path: toAbsolutePath(entry.path),
  mtime: entry.mtime,
  size: entry.size,
});

const shouldIgnore = (
  name: string,
  relativePath: string,
  matchers: IgnoreMatcher[]
): boolean =>
  matchers.some((match) => match(name) || match(relativePath));

export const findDeletedLocally = (
  localFiles: LocalFile[],
  stateData: SyncStateData
): string[] => {
  const localPaths = new Set(localFiles.map((f) => f.path));
  return Object.keys(stateData.files).filter((path) => !localPaths.has(path));
};
