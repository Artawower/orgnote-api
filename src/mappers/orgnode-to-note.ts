import { OrgNode } from 'org-mode-ast';
import { DiskFile, NoteInfo } from 'src/models';
import { ModelsNoteMeta } from 'src/remote-api';
import { splitPath } from 'src/utils';

export function orgnodeToNoteInfo(
  orgnode: OrgNode,
  fileInfo: DiskFile,
  isMy?: boolean
): NoteInfo {
  return {
    id: orgnode.meta.id,
    isMy,
    meta: orgnode.meta as unknown as ModelsNoteMeta,
    filePath: splitPath(fileInfo.path),
    touchedAt: fileInfo.atime && new Date(fileInfo.atime).toISOString(),
    updatedAt: new Date(Math.max(fileInfo.mtime, fileInfo.ctime)).toISOString(),
    createdAt: fileInfo.ctime && new Date(fileInfo.ctime).toISOString(),
  };
}
