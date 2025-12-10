import type { EncryptionType } from './encryption';

export interface NotesFilter {
  searchText?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}

export interface NoteMeta {
  id?: string;
  title?: string;
  description?: string;
  fileTags?: string[];
  previewImg?: string;
  published?: boolean;
  startup?: string;
  images?: string[];
  connectedNotes?: Record<string, string>;
}

export interface PublicUser {
  id?: string;
  name?: string;
  nickName?: string;
  avatarUrl?: string;
  email?: string;
  profileUrl?: string;
}

export interface NoteInfo {
  id?: string;
  meta?: NoteMeta;
  createdAt?: string;
  encryptionType?: EncryptionType;
  updatedAt?: string;
  touchedAt?: string;
  deletedAt?: string;
  filePath?: string[];
  isMy?: boolean;
  author?: PublicUser;
  bookmarked?: boolean;
  encrypted?: boolean;
}
