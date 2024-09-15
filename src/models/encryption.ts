import type { ModelsPublicNoteEncryptionTypeEnum } from '../remote-api';

export type EcnryptionFormat = 'binary' | 'armored';

export interface BaseOrgNoteEncryption {
  format?: 'binary' | 'armored';
}

export interface BaseOrgNoteDecryption {
  format?: 'utf8' | 'binary';
}

export interface OrgNoteGpgEncryption {
  type: typeof ModelsPublicNoteEncryptionTypeEnum.GpgKeys;
  /* Armored private key */
  privateKey: string;
  /* Armored public key */
  publicKey?: string;
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

export type EncryptionData = {
  content: string;
};

export type WithEncryptionContent<
  T extends OrgNoteEncryption = OrgNoteEncryption,
> = T & EncryptionData & BaseOrgNoteEncryption;

export type DecriptionData = {
  content: string | Uint8Array;
};

export type WithDecryptionContent<
  T extends OrgNoteEncryption = OrgNoteEncryption,
> = T & DecriptionData & BaseOrgNoteDecryption;

export type WithNoteDecryptionContent<
  T extends OrgNoteEncryption = OrgNoteEncryption,
> = T & DecriptionData;
