import { HandlersCreatingNote, HandlersSyncNotesRequest } from 'src/remote-api';
import { NoteChange, NoteChanges, FileSystem } from '../models';
import { isOrgGpgFile } from './is-org-file';

export async function extendNotesFilesDiff(
  changes: NoteChanges,
  readFile: FileSystem['readFile']
): Promise<HandlersSyncNotesRequest> {
  const upsertedNotesFromLastSync: NoteChange[] = [
    ...changes.updated,
    ...changes.created,
  ];

  const notesFromLastSync: HandlersCreatingNote[] = [];

  for (const nc of upsertedNotesFromLastSync) {
    const encrypted = isOrgGpgFile(nc.filePath);
  }

  const noteIdsFromLastSync = new Set(notesFromLastSync.map((n) => n.id));

  const deletedNotesIdsWithoutRename = changes.deleted.reduce<string[]>(
    (acc, nc) => {
      if (!noteIdsFromLastSync.has(nc.id)) {
        acc.push(nc.id);
      }
      return acc;
    },
    []
  );

  return {
    deletedNotesIds: deletedNotesIdsWithoutRename,
  };
}
