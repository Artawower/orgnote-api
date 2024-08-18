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
import { isGpgEncrypted } from '..';

export type NoteEncryptionType = `${ModelsPublicNote['encryptionType']}`;

export interface AbstractEncryptedNote {
  encryptionType?: NoteEncryptionType;
  encrypted?: boolean;
  meta: {
    [key: string]: any;
    published?: boolean;
  };
}

export type EncryptionResult<T> = Promise<[T, string]>;

// TODO: master change signature for encrypt notes without content
export async function encryptNote<T extends AbstractEncryptedNote>(
  note: T,
  noteText: string,
  encryptionParams: OrgNoteEncryption
): EncryptionResult<T> {
  note.encrypted = false;
  if (
    !encryptionParams.type ||
    encryptionParams.type === ModelsPublicNoteEncryptionTypeEnum.Disabled ||
    note.meta.published
  ) {
    return [note, noteText];
  }

  note.meta = { id: note.meta.id, published: note.meta.published };

  const [encryptedNote, encryptedNoteText] =
    encryptionParams.type === ModelsPublicNoteEncryptionTypeEnum.GpgKeys
      ? await encryptNoteViaKeys(
          note,
          encryptionParams.publicKey,
          encryptionParams.privateKey,
          encryptionParams.privateKeyPassphrase
        )
      : await encryptNoteViaPassword(note, noteText, encryptionParams.password);

  encryptedNote.encrypted = true;
  return [encryptedNote, encryptedNoteText];
}
export async function encryptNoteViaPassword<T extends AbstractEncryptedNote>(
  note: T,
  noteText: string,
  password: string
): Promise<[T, string]> {
  const encryptedNoteText = await encryptViaPassword(noteText, password);
  return [
    {
      ...note,
      encrypted: ModelsPublicNoteEncryptionTypeEnum.GpgPassword,
    },
    encryptedNoteText,
  ];
}

export async function encryptNoteViaKeys<T extends AbstractEncryptedNote>(
  note: T,
  noteText: string,
  publicKey: string,
  privateKey: string,
  privateKeyPassphrase?: string
): Promise<[T, string]> {
  const encryptedNoteText = await encryptViaKeys(
    noteText,
    publicKey,
    privateKey,
    privateKeyPassphrase
  );

  return [
    {
      ...note,
      encrypted: ModelsPublicNoteEncryptionTypeEnum.GpgKeys,
    },
    encryptedNoteText,
  ];
}

export async function decryptNote<T extends AbstractEncryptedNote>(
  note: T,
  noteText: string,
  encryptionParams: OrgNoteEncryption
): EncryptionResult<T> {
  const isContentEncrypted = isGpgEncrypted(noteText);
  if (
    note.meta.published ||
    !note.encryptionType ||
    !encryptionParams.type ||
    encryptionParams.type === ModelsPublicNoteEncryptionTypeEnum.Disabled ||
    !isContentEncrypted
  ) {
    note.encrypted = isContentEncrypted;
    return [note, noteText];
  }
  note.encrypted = true;
  const [decryptedNote, decryptedNoteText] =
    encryptionParams.type === ModelsPublicNoteEncryptionTypeEnum.GpgKeys
      ? await decryptNoteViaKeys(
          note,
          noteText,
          encryptionParams.privateKey,
          encryptionParams.privateKeyPassphrase
        )
      : await decryptNoteViaPassword(note, noteText, encryptionParams.password);

  const parsed = withMetaInfo(parse(decryptedNoteText));

  return [
    {
      ...decryptedNote,
      encrypted: false,
      meta: parsed.meta,
    },
    decryptedNoteText,
  ];
}

export async function decryptNoteViaPassword<T extends AbstractEncryptedNote>(
  note: T,
  noteText: string,
  password: string
): EncryptionResult<T> {
  const decryptedNoteText = await decryptViaPassword(noteText, password);
  return [
    {
      ...note,
      encrypted: ModelsPublicNoteEncryptionTypeEnum.GpgPassword,
    },
    decryptedNoteText,
  ];
}

export async function decryptNoteViaKeys<T extends AbstractEncryptedNote>(
  note: T,
  noteText: string,
  privateKey: string,
  privateKeyPassphrase?: string
): EncryptionResult<T> {
  const decryptedNoteText = await decryptViaKeys(
    noteText,
    privateKey,
    privateKeyPassphrase
  );
  return [
    {
      ...note,
      encrypted: ModelsPublicNoteEncryptionTypeEnum.GpgKeys,
    },
    decryptedNoteText,
  ];
}
