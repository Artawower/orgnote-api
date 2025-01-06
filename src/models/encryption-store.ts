import {
  BaseOrgNoteEncryption,
  OrgNoteEncryption,
  BaseOrgNoteDecryption,
} from './encryption';
import { NoteInfo } from './note';
import { Store } from './store';

export interface EncryptionStore {
  encrypt: (
    text: string,
    format?: BaseOrgNoteEncryption['format'],
    encryptionConfig?: OrgNoteEncryption
  ) => Promise<string>;
  decrypt: (
    content: string | Uint8Array,
    format?: BaseOrgNoteDecryption['format'],
    encryptionConfig?: OrgNoteEncryption
  ) => Promise<string>;
  encryptNote: (
    noteInfo: NoteInfo,
    noteText: string
  ) => Promise<[NoteInfo, string]>;
  decryptNote: (
    noteInfo: NoteInfo,
    noteText: string
  ) => Promise<[NoteInfo, string | Uint8Array]>;
}

export type EncryptionStoreDefinition = Store<EncryptionStore>;
