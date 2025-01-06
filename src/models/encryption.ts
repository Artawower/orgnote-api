import { ModelsPublicNoteEncryptionTypeEnum } from '../remote-api';
import { object, string, union, optional, literal, InferOutput } from 'valibot';

export type EcnryptionFormat = 'binary' | 'armored';

export interface BaseOrgNoteEncryption {
  format?: 'binary' | 'armored';
}

export interface BaseOrgNoteDecryption {
  format?: 'utf8' | 'binary';
}

const OrgNoteGpgEncryptionSchema = object({
  type: literal(ModelsPublicNoteEncryptionTypeEnum.GpgKeys),
  privateKey: string(),
  publicKey: optional(string()),
  privateKeyPassphrase: optional(string()),
});

const OrgNotePasswordEncryptionSchema = object({
  type: literal(ModelsPublicNoteEncryptionTypeEnum.GpgPassword),
  password: string(),
});

const OrgNoteDisabledEncryptionSchema = object({
  type: literal(ModelsPublicNoteEncryptionTypeEnum.Disabled),
});

export const OrgNoteEncryptionSchema = union([
  OrgNoteGpgEncryptionSchema,
  OrgNotePasswordEncryptionSchema,
  OrgNoteDisabledEncryptionSchema,
]);

export type OrgNoteGpgEncryption = InferOutput<
  typeof OrgNoteGpgEncryptionSchema
>;
export type OrgNotePasswordEncryption = InferOutput<
  typeof OrgNotePasswordEncryptionSchema
>;
export type OrgNoteEncryption = InferOutput<typeof OrgNoteEncryptionSchema>;

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
