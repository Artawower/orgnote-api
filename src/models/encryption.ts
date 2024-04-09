import type { ModelsPublicNoteEncryptedEnum } from 'src/remote-api';

export interface OrgNoteGpgEncryption {
  type: typeof ModelsPublicNoteEncryptedEnum.GpgKeys;
  privateKey: string;
  publicKey: string;
  privateKeyPassphrase?: string;
}

export interface OrgNotePasswordEncryption {
  type: typeof ModelsPublicNoteEncryptedEnum.GpgPassword;
  password: string;
}

export interface OrgNoteDisabledEncryption {
  type: typeof ModelsPublicNoteEncryptedEnum.Disabled;
}

export type OrgNoteEncryption =
  | OrgNoteGpgEncryption
  | OrgNotePasswordEncryption
  | OrgNoteDisabledEncryption;
