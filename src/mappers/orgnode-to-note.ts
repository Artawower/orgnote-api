import { OrgNode } from 'org-mode-ast';
import { ModelsNoteMeta } from 'orgnote-api/remote-api';
import { FileInfo, Note } from 'src/models';
import { splitPath } from 'src/tools';

export function orgnodeToNote(orgnode: OrgNode, fileInfo: FileInfo): Note {
  return {
    id: orgnode.meta.id,
    meta: orgnode.meta as unknown as ModelsNoteMeta,
    filePath: splitPath(fileInfo.path),
    touchedAt: new Date(fileInfo.atime).toISOString(),
    updatedAt: new Date(Math.max(fileInfo.mtime, fileInfo.ctime)).toISOString(),
    createdAt: new Date(fileInfo.ctime).toISOString(),
  };
}
