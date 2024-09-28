import { OrgNode } from 'org-mode-ast';
import { FileInfo, Note } from 'src/models';
import { ModelsNoteMeta } from 'src/remote-api';
import { splitPath } from 'src/tools';

export function orgnodeToNote(orgnode: OrgNode, fileInfo: FileInfo): Note {
  return {
    id: orgnode.meta.id,
    meta: orgnode.meta as unknown as ModelsNoteMeta,
    filePath: splitPath(fileInfo.path),
    touchedAt: fileInfo.atime && new Date(fileInfo.atime).toISOString(),
    updatedAt: new Date(Math.max(fileInfo.mtime, fileInfo.ctime)).toISOString(),
    createdAt: fileInfo.ctime && new Date(fileInfo.ctime).toISOString(),
  };
}
