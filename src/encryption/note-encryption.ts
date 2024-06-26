import { ModelsPublicNote, ModelsPublicNoteEncryptedEnum } from '../remote-api';

import {
  decryptViaKeys,
  decryptViaPassword,
  encryptViaKeys,
  encryptViaPassword,
} from './encryption';
import { OrgNoteEncryption } from '../models/encryption';
import { parse, withMetaInfo } from 'org-mode-ast';

export type NoteEncryptedType = `${ModelsPublicNote['encrypted']}`;
export interface AbstractEncryptedNote {
  content: string;
  encrypted?: NoteEncryptedType;
  meta: {
    [key: string]: any;
    published?: boolean;
  };
}
export async function encryptNote<T extends AbstractEncryptedNote>(
  note: T,
  encryptionParams: OrgNoteEncryption
): Promise<T> {
  if (
    !encryptionParams.type ||
    encryptionParams.type === ModelsPublicNoteEncryptedEnum.Disabled ||
    note.meta.published
  ) {
    return note;
  }

  note.meta = { id: note.meta.id, published: note.meta.published };

  if (encryptionParams.type === ModelsPublicNoteEncryptedEnum.GpgKeys) {
    return await encryptNoteViaKeys(
      note,
      encryptionParams.publicKey,
      encryptionParams.privateKey,
      encryptionParams.privateKeyPassphrase
    );
  }
  return await encryptNoteViaPassword(note, encryptionParams.password);
}
export async function encryptNoteViaPassword<T extends AbstractEncryptedNote>(
  note: T,
  password: string
): Promise<T> {
  const content = await encryptViaPassword(note.content, password);
  return {
    ...note,
    content,
    encrypted: ModelsPublicNoteEncryptedEnum.GpgPassword,
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
    encrypted: ModelsPublicNoteEncryptedEnum.GpgKeys,
  };
}

export async function decryptNote<T extends AbstractEncryptedNote>(
  note: T,
  encryptionParams: OrgNoteEncryption
): Promise<T> {
  if (
    note.meta.published ||
    !note.encrypted ||
    !encryptionParams.type ||
    encryptionParams.type === ModelsPublicNoteEncryptedEnum.Disabled
  ) {
    return note;
  }
  const decryptedNote =
    encryptionParams.type === ModelsPublicNoteEncryptedEnum.GpgKeys
      ? await decryptNoteViaKeys(
          note,
          encryptionParams.privateKey,
          encryptionParams.privateKeyPassphrase
        )
      : await decryptNoteViaPassword(note, encryptionParams.password);

  const parsed = withMetaInfo(parse(decryptedNote.content));

  return {
    ...decryptedNote,
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
    encrypted: ModelsPublicNoteEncryptedEnum.GpgPassword,
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
    encrypted: ModelsPublicNoteEncryptedEnum.GpgKeys,
  };
}
