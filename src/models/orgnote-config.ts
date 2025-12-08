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
  pipe,
  unknown,
  objectWithRest,
} from 'valibot';
import { OrgNoteEncryptionSchema } from './encryption';

export const ORG_NOTE_CONFIG_SCHEMA = pipe(
  objectWithRest(
    {
      editor: object({
        showSpecialSymbols: boolean(),
        showPropertyDrawer: boolean(),
        saveDelayMs: optional(number()),
        validationDelayMs: optional(number()),
      }),
      developer: object({
        developerMode: boolean(),
        maximumLogsCount: number(),
        storeQueueTasksMinutes: number(),
        corsProxy: string(),
      }),
      completion: object({
        showGroup: boolean(),
        defaultCompletionLimit: number(),
        fuseThreshold: optional(number()),
      }),
      system: object({
        language: string(),
      }),
      synchronization: object({
        type: union([literal('none'), literal('api')]),
      }),
      ui: object({
        showUserProfiles: boolean(),
        theme: union([literal('light'), literal('dark'), literal('auto')]),
        darkThemeName: optional(union([string(), literal(null)])),
        lightThemeName: optional(union([string(), literal(null)])),
        enableAnimations: boolean(),
        notificationTimeout: optional(number()),
        persistantPanes: optional(boolean()),
        persistantPanesSaveDelay: number(),
        dropZoneEdgeRatio: number(),
      }),
      extensions: object({
        sources: array(string()),
      }),
      encryption: OrgNoteEncryptionSchema,
    },
    unknown()
  )
);

/* Settings are stored in memory */
export interface DefinedOrgNoteSettings {
  vault?: string;
}

export type OrgNoteSettings = DefinedOrgNoteSettings & {
  [key: string]: unknown;
};

export type OrgNoteConfig = InferOutput<typeof ORG_NOTE_CONFIG_SCHEMA> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
