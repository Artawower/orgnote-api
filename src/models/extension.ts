import { OrgNoteApi } from '../api';

import {
  object,
  string,
  union,
  optional,
  array,
  boolean,
  InferOutput,
} from 'valibot';

export const EXTENSION_MANIFEST_SCHEMA = object({
  name: string(),
  version: string(),
  platforms: optional(
    array(
      union([
        string('mobile'),
        string('desktop'),
        string('capacitor'),
        string('nativeMobile'),
        string('electron'),
        string('linux'),
        string('mac'),
        string('win'),
        string('chrome'),
        string('firefox'),
        string('opera'),
        string('safari'),
        string('webkit'),
        string('ios'),
        string('ipad'),
        string('iphone'),
        string('ipod'),
        string('winphone'),
        string('blackberry'),
      ])
    )
  ),
  category: union([
    string('theme'),
    string('extension'),
    string('language pack'),
    string('other'),
  ]),
  apiVersion: optional(string()),
  author: optional(string()),
  description: optional(string()),
  keywords: optional(array(string())),
  sourceType: union([string('git'), string('file'), string('builtin')]),
  readmeFilePath: optional(string()),
  permissions: optional(
    array(
      union([
        string('files'),
        string('personal info'),
        string('*'),
        string('third party'),
      ])
    )
  ),
  reloadRequired: optional(boolean()),
  sourceUrl: optional(string()),
  sponsor: optional(array(string())),
  development: optional(boolean()),
  icon: optional(string()),
});

export type ExtensionManifest = InferOutput<typeof EXTENSION_MANIFEST_SCHEMA>;

export interface Extension {
  [key: string]: unknown;

  onMounted: (api: OrgNoteApi) => Promise<void>;
  onUnmounted?: (api: OrgNoteApi) => Promise<void>;
}

export interface ExtensionMeta {
  manifest: ExtensionManifest;
  uploaded?: boolean;
  active?: boolean;
}

export interface StoredExtension extends ExtensionMeta {
  module?: string;
}

export interface ActiveExtension extends ExtensionMeta {
  module: Extension;
}
