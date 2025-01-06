import {
  object,
  boolean,
  number,
  string,
  union,
  optional,
  array,
  literal,
  InferOutput,
} from 'valibot';
import { OrgNoteEncryptionSchema } from './encryption';

export const ORG_NOTE_CONFIG_SCHEMA = object({
  editor: object({
    showSpecialSymbols: boolean(),
    showPropertyDrawer: boolean(),
  }),
  developer: object({
    developerMode: boolean(),
    maximumLogsCount: number(),
  }),
  completion: object({
    showGroup: boolean(),
    defaultCompletionLimit: number(),
  }),
  system: object({
    language: string(),
  }),
  synchronization: object({
    type: union([literal('none'), literal('api')]),
  }),
  vault: object({
    type: union([literal('inmemory'), literal('filesystem')]),
    path: optional(string()),
  }),
  ui: object({
    showUserProfiles: boolean(),
    theme: union([literal('light'), literal('dark'), literal('auto')]),
    darkThemeName: optional(union([string(), literal(null)])),
    lightThemeName: optional(union([string(), literal(null)])),
  }),
  extensions: object({
    sources: array(string()),
  }),
  encryption: OrgNoteEncryptionSchema,
});

export type OrgNoteConfig = InferOutput<typeof ORG_NOTE_CONFIG_SCHEMA>;
