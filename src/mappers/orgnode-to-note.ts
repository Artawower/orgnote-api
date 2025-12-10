import { OrgNode } from 'org-mode-ast';
import { DiskFile, NoteInfo, NoteMeta } from 'src/models';
import { splitPath } from 'src/utils';

export function orgnodeToNoteInfo(
  orgnode: OrgNode,
  fileInfo: DiskFile,
  isMy?: boolean
): NoteInfo {
  return {
    id: orgnode.meta.id,
    isMy,
    meta: orgnode.meta as unknown as NoteMeta,
    filePath: splitPath(fileInfo.path),
    touchedAt: fileInfo.atime && new Date(fileInfo.atime).toISOString(),
    updatedAt: new Date(Math.max(fileInfo.mtime, fileInfo.ctime)).toISOString(),
    createdAt: fileInfo.ctime && new Date(fileInfo.ctime).toISOString(),
  };
}
