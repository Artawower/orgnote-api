export interface FileMetaFilter {
  limit?: number;
  offset?: number;
  tags?: string[];
}

export type FileTaskKind =
  | 'list-checkbox'
  | 'headline-checkbox'
  | 'headline-todo';

export type FileTaskState = 'todo' | 'done';

export interface FileTask {
  id: string;
  kind: FileTaskKind;
  state: FileTaskState;
  text: string;
  line: number;
  start?: number;
  end?: number;
}

export interface FileMeta {
  id: string;
  filePath: string[];
  title?: string;
  description?: string;
  tags?: string[];
  links?: string[];
  backlinks?: string[];
  tasks?: FileTask[];
  createdAt?: string;
  updatedAt?: string;
  touchedAt?: string;
  deletedAt?: string;
}
