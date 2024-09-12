import { getStringPath } from './get-string-path';

export interface ChangedFiles {
  deleted: string[];
  created: string[];
  updated: string[];
}

export interface StoredNoteInfo {
  filePath: string[];
  id: string;
  updatedAt: string | Date;
}

export function findNotesFilesDiff(
  filePaths: string[],
  storedNotesInfo: StoredNoteInfo[],
  updatedTimeGetter: (filePath: string) => Date
): ChangedFiles {
  const existingFilePaths = new Set<string>(filePaths);

  const storedNotesPathSet = new Set<string>(
    storedNotesInfo.map((n) => getStringPath(n.filePath))
  );
  const changedFiles: ChangedFiles = { deleted: [], created: [], updated: [] };

  storedNotesInfo.forEach((storedNote) => {
    const fullPath = getStringPath(storedNote.filePath);
    if (!existingFilePaths.has(fullPath)) {
      changedFiles.deleted.push(fullPath);
      return;
    }

    const updatedTime = updatedTimeGetter(fullPath);
    if (updatedTime > new Date(storedNote.updatedAt)) {
      changedFiles.updated.push(fullPath);
    }
  });

  filePaths.forEach((filePath) => {
    if (!storedNotesPathSet.has(filePath)) {
      changedFiles.created.push(filePath);
      return;
    }
  });

  return changedFiles;
}
