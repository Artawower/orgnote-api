import { ExtensionMeta, StoredExtension } from './extension';
import { FileCache } from './file-cache';
import { FilePathInfo } from './file-path';
import { Note, NotePreview } from './note';

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

export interface FileRepository {
  upsert(file: FileCache): Promise<void>;
  bulkUpsert(file: FileCache[]): Promise<void>;
  update(filePath: string, file: Partial<FileCache>): Promise<void>;
  delete(filePath: string): Promise<void>;
  markAsDelete(filePath: string, deletedAt?: Date): Promise<void>;
  clear(): Promise<void>;
  // TODO: this method will be deleted.
  getFirstUnuploaded(): Promise<FileCache>;

  // TODO: add pagination support
  search(text: string): Promise<FileCache[]>;
  getByPath(path: string): Promise<FileCache>;
  getAll(): Promise<FileCache[]>;
  getFilesAfterUpdateTime(updatedTime?: Date): Promise<FileCache[]>;
  count(updatedTime?: Date): Promise<number>;
}

export interface NoteRepository {
  getNotesAfterUpdateTime(updatedTime?: string): Promise<Note[]>;
  getDeletedNotes(): Promise<Note[]>;
  saveNotes(notes: Note[]): Promise<void>;
  putNote(note: Note): Promise<void>;
  getById(id: string): Promise<Note>;
  getByPath(path: string[]): Promise<Note>;
  getNotePreviews(options?: {
    limit?: number;
    offset?: number;
    searchText?: string;
    tags?: string[];
    bookmarked?: boolean;
  }): Promise<NotePreview[]>;
  deleteNotes(noteIds: string[]): Promise<void>;
  markAsDeleted(noteIds: string[]): Promise<void>;
  bulkPartialUpdate(
    updates: { id: string; changes: Partial<Note> }[]
  ): Promise<void>;
  count(searchText?: string, tags?: string[]): Promise<number>;
  getFilePaths(): Promise<FilePathInfo[]>;
  touchNote(noteId: string): Promise<void>;
  getTagsStatistic(): Promise<{ tag: string; count: number }[]>;
  addBookmark(noteId: string): Promise<void>;
  deleteBookmark(noteId: string): Promise<void>;
  modify(
    modifyCallback: (note: Note, ref: { value: Note }) => void
  ): Promise<void>;
  getIds(filterCb?: (n: Note) => boolean): Promise<string[]>;
  clear(): Promise<void>;
}

export interface Repositories {
  notes: NoteRepository;
  files: FileRepository;
  extensions: ExtensionRepository;
}
