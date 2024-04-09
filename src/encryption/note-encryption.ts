import {
  ModelsPublicNote,
  ModelsPublicNoteEncryptedEnum,
} from 'src/remote-api';
import {
  decryptViaKeys,
  decryptViaPassword,
  encryptViaKeys,
  encryptViaPassword,
} from './encryption';
import { OrgNoteEncryption } from 'src/models/encryption';

interface AbstractNote {
  content: string;
  encrypted: ModelsPublicNote['encrypted'];
  meta: {
    published: boolean;
  };
}

export async function encrypt<T extends AbstractNote>(
  note: T,
  encryptionParams: OrgNoteEncryption
): Promise<T> {
  if (encryptionParams.type === ModelsPublicNoteEncryptedEnum.GpgKeys) {
    return encryptNoteViaKeys(
      note,
      encryptionParams.publicKey,
      encryptionParams.privateKey,
      encryptionParams.privateKeyPassphrase
    );
  }
  if (encryptionParams.type === ModelsPublicNoteEncryptedEnum.GpgPassword) {
    return encryptNoteViaPassword(note, encryptionParams.password);
  }
  return note;
}
export async function encryptNoteViaPassword<T extends AbstractNote>(
  note: T,
  password: string
): Promise<T> {
  const content = encryptViaPassword(note.content, password);
  return {
    ...note,
    content,
    encrypted: ModelsPublicNoteEncryptedEnum.GpgPassword,
  };
}

export async function encryptNoteViaKeys<T extends AbstractNote>(
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

export async function decrypt<T extends AbstractNote>(
  note: T,
  encryptionParams: OrgNoteEncryption
): Promise<T> {
  if (encryptionParams.type === ModelsPublicNoteEncryptedEnum.GpgKeys) {
    return decryptNoteViaKeys(
      note,
      encryptionParams.privateKey,
      encryptionParams.privateKeyPassphrase
    );
  }
  if (encryptionParams.type === ModelsPublicNoteEncryptedEnum.GpgPassword) {
    return decryptNoteViaPassword(note, encryptionParams.password);
  }
  return note;
}

export async function decryptNoteViaPassword<T extends AbstractNote>(
  note: T,
  password: string
): Promise<T> {
  const content = decryptViaPassword(note.content, password);
  return {
    ...note,
    content,
    encrypted: ModelsPublicNoteEncryptedEnum.GpgPassword,
  };
}

export async function decryptNoteViaKeys<T extends AbstractNote>(
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
