export interface FileMetaFilter {
  limit?: number;
  offset?: number;
  tags?: string[];
}

export interface FileMeta {
  id: string;
  filePath: string[];
  title?: string;
  description?: string;
  tags?: string[];
  links?: string[];
  backlinks?: string[];
  createdAt?: string;
  updatedAt?: string;
  touchedAt?: string;
  deletedAt?: string;
}
