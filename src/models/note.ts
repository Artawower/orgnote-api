import type { ModelsPublicNote, ModelsPublicUser } from '../remote-api';

export interface NotesFilter {
  searchText?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}

export interface NoteInfo {
  id: ModelsPublicNote['id'];
  meta: ModelsPublicNote['meta'];
  createdAt: ModelsPublicNote['createdAt'];
  encryptionType?: ModelsPublicNote['encryptionType'];
  updatedAt: ModelsPublicNote['updatedAt'];
  touchedAt: ModelsPublicNote['touchedAt'];
  deletedAt?: string;
  filePath: ModelsPublicNote['filePath'];
  isMy?: ModelsPublicNote['isMy'];
  // TODO: feat/stable-beta think about removing this field
  // maybe we need to do it in the blog style
  author?: ModelsPublicUser;
  bookmarked?: boolean;
  encrypted?: boolean;
}
