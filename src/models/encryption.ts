import type { ModelsPublicNoteEncryptionTypeEnum } from '../remote-api';

export interface OrgNoteGpgEncryption {
  type: typeof ModelsPublicNoteEncryptionTypeEnum.GpgKeys;
  privateKey: string;
  publicKey: string;
  privateKeyPassphrase?: string;
}

export interface OrgNotePasswordEncryption {
  type: typeof ModelsPublicNoteEncryptionTypeEnum.GpgPassword;
  password: string;
}

export interface OrgNoteDisabledEncryption {
  type: typeof ModelsPublicNoteEncryptionTypeEnum.Disabled;
}

export type OrgNoteEncryption =
  | OrgNoteGpgEncryption
  | OrgNotePasswordEncryption
  | OrgNoteDisabledEncryption;
