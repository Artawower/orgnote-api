import type { Ref } from 'vue';
import { Store } from './store';
import { FileNode } from './file-tree';

export interface FileManagerStore {
  fileTree: Ref<FileNode[]>;
  renameFile: (fileNode: FileNode, newName: string) => Promise<void>;
  deleteFile: (fileNode: FileNode) => Promise<void>;
  updateFileManager: () => void;
  createFolder: (filePath?: string[], name?: string) => Promise<void>;
  editedFileItem: Ref<FileNode>;
  stopEdit: () => void;
  expandedNodes: Ref<string[]>;
}

export type FileManageStoreDefinition = Store<FileManagerStore>;
