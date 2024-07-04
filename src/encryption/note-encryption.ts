import {
  ModelsPublicNote,
  ModelsPublicNoteEncryptionTypeEnum,
} from '../remote-api';

import {
  decryptViaKeys,
  decryptViaPassword,
  encryptViaKeys,
  encryptViaPassword,
} from './encryption';
import { OrgNoteEncryption } from '../models/encryption';
import { parse, withMetaInfo } from 'org-mode-ast';

export type NoteEncryptionType = `${ModelsPublicNote['encryptionType']}`;

export interface AbstractEncryptedNote {
  content: string;
  encryptionType?: NoteEncryptionType;
  encrypted?: boolean;
  meta: {
    [key: string]: any;
    published?: boolean;
  };
}
export async function encryptNote<T extends AbstractEncryptedNote>(
  note: T,
  encryptionParams: OrgNoteEncryption
): Promise<T> {
  note.encrypted = false;
  if (
    !encryptionParams.type ||
    encryptionParams.type === ModelsPublicNoteEncryptionTypeEnum.Disabled ||
    note.meta.published
  ) {
    return note;
  }

  note.meta = { id: note.meta.id, published: note.meta.published };

  const encryptedNote =
    encryptionParams.type === ModelsPublicNoteEncryptionTypeEnum.GpgKeys
      ? await encryptNoteViaKeys(
          note,
          encryptionParams.publicKey,
          encryptionParams.privateKey,
          encryptionParams.privateKeyPassphrase
        )
      : await encryptNoteViaPassword(note, encryptionParams.password);

  encryptedNote.encrypted = true;
  return encryptedNote;
}
export async function encryptNoteViaPassword<T extends AbstractEncryptedNote>(
  note: T,
  password: string
): Promise<T> {
  const content = await encryptViaPassword(note.content, password);
  return {
    ...note,
    content,
    encrypted: ModelsPublicNoteEncryptionTypeEnum.GpgPassword,
  };
}

export async function encryptNoteViaKeys<T extends AbstractEncryptedNote>(
  note: T,
  publicKey: string,
  privateKey: string,
  privateKeyPassphrase?: string
): Promise<T> {
  const content = await encryptViaKeys(
    note.content,
    publicKey,
    privateKey,
    privateKeyPassphrase
  );

  return {
    ...note,
    content,
    encrypted: ModelsPublicNoteEncryptionTypeEnum.GpgKeys,
  };
}

export async function decryptNote<T extends AbstractEncryptedNote>(
  note: T,
  encryptionParams: OrgNoteEncryption
): Promise<T> {
  if (
    note.meta.published ||
    !note.encryptionType ||
    !encryptionParams.type ||
    encryptionParams.type === ModelsPublicNoteEncryptionTypeEnum.Disabled
  ) {
    note.encrypted = false;
    return note;
  }
  note.encrypted = true;
  const decryptedNote =
    encryptionParams.type === ModelsPublicNoteEncryptionTypeEnum.GpgKeys
      ? await decryptNoteViaKeys(
          note,
          encryptionParams.privateKey,
          encryptionParams.privateKeyPassphrase
        )
      : await decryptNoteViaPassword(note, encryptionParams.password);

  const parsed = withMetaInfo(parse(decryptedNote.content));

  return {
    ...decryptedNote,
    encrypted: false,
    meta: parsed.meta,
  };
}

export async function decryptNoteViaPassword<T extends AbstractEncryptedNote>(
  note: T,
  password: string
): Promise<T> {
  const content = await decryptViaPassword(note.content, password);
  return {
    ...note,
    content,
    encrypted: ModelsPublicNoteEncryptionTypeEnum.GpgPassword,
  };
}

export async function decryptNoteViaKeys<T extends AbstractEncryptedNote>(
  note: T,
  privateKey: string,
  privateKeyPassphrase?: string
): Promise<T> {
  const content = await decryptViaKeys(
    note.content,
    privateKey,
    privateKeyPassphrase
  );
  return {
    ...note,
    content,
    encrypted: ModelsPublicNoteEncryptionTypeEnum.GpgKeys,
  };
}
