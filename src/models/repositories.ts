import { ExtensionMeta, StoredExtension } from './extension';
import { FileInfo } from './file-info';
import { FilePathInfo } from './file-path';
import { NoteInfo } from './note';

export interface ExtensionRepository {
  getMeta(): Promise<ExtensionMeta[]>;
  getActiveExtensions(): Promise<StoredExtension[]>;
  setActiveStatus(extensionName: string, active: boolean): Promise<void>;
  activateExtension(extensionName: string): Promise<void>;
  deactivateExtension(extensionName: string): Promise<void>;
  upsertExtensions(extensions: StoredExtension[]): Promise<void>;
  getExtension(extensionName: string): Promise<StoredExtension>;
  getExtensionBySource(source: string): Promise<StoredExtension>;
  deleteBySource(source: string): Promise<void>;
  delete(extensionName: string): Promise<void>;
}

export interface FileInfoRepository {
  upsert(file: FileInfo): Promise<void>;
  bulkUpsert(file: FileInfo[]): Promise<void>;
  update(filePath: string, file: Partial<FileInfo>): Promise<void>;
  delete(filePath: string): Promise<void>;
  markAsDelete(filePath: string, deletedAt?: Date): Promise<void>;
  clear(): Promise<void>;

  search(text: string): Promise<FileInfo[]>;
  getByPath(path: string): Promise<FileInfo>;
  getAll(): Promise<FileInfo[]>;
  getFilesAfterUpdateTime(updatedTime?: Date): Promise<FileInfo[]>;
  count(updatedTime?: Date): Promise<number>;
}

export interface NoteInfoRepository {
  getNotesAfterUpdateTime(updatedTime?: string): Promise<NoteInfo[]>;
  getDeletedNotes(): Promise<NoteInfo[]>;
  saveNotes(notes: NoteInfo[]): Promise<void>;
  putNote(note: NoteInfo): Promise<void>;
  getById(id: string): Promise<NoteInfo>;
  getByPath(path: string[]): Promise<NoteInfo>;
  getNotesInfo(options?: {
    limit?: number;
    offset?: number;
    searchText?: string;
    tags?: string[];
    bookmarked?: boolean;
  }): Promise<NoteInfo[]>;
  deleteNotes(noteIds: string[]): Promise<void>;
  markAsDeleted(noteIds: string[]): Promise<void>;
  bulkPartialUpdate(
    updates: { id: string; changes: Partial<NoteInfo> }[]
  ): Promise<void>;
  count(searchText?: string, tags?: string[]): Promise<number>;
  getFilePaths(): Promise<FilePathInfo[]>;
  touchNote(noteId: string): Promise<void>;
  getTagsStatistic(): Promise<{ tag: string; count: number }[]>;
  addBookmark(noteId: string): Promise<void>;
  deleteBookmark(noteId: string): Promise<void>;
  modify(
    modifyCallback: (note: NoteInfo, ref: { value: NoteInfo }) => void
  ): Promise<void>;
  getIds(filterCb?: (n: NoteInfo) => boolean): Promise<string[]>;
  clear(): Promise<void>;
}

export interface Repositories {
  fileMetaRepository: FileInfoRepository;
  noteMetaRepository: NoteInfoRepository;
  extensions: ExtensionRepository;
}
