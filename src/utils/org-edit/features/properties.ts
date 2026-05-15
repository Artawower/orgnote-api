import type { OrgNode } from 'org-mode-ast';
import { NodeType } from 'org-mode-ast';
import type { OrgProperties } from '../types';

const findPropertyDrawer = (headline: OrgNode): OrgNode | undefined =>
  headline.section?.childrenList.find((n) => n.is(NodeType.PropertyDrawer));

const stripPropertyKey = (raw: string): string => {
  const withoutLeadingColon = raw.startsWith(':') ? raw.slice(1) : raw;
  const closingColonIdx = withoutLeadingColon.indexOf(':');
  const key =
    closingColonIdx === -1
      ? withoutLeadingColon
      : withoutLeadingColon.slice(0, closingColonIdx);
  return key.trim();
};

const DRAWER_MARKERS = new Set([':PROPERTIES:', ':END:']);

const readPropertyEntry = (property: OrgNode): [string, string] | undefined => {
  const textChildren = property.childrenList.filter((c) => c.is(NodeType.Text));
  const keyNode = textChildren[0];
  if (!keyNode) return undefined;
  if (DRAWER_MARKERS.has(keyNode.value.trim())) return undefined;
  const key = stripPropertyKey(keyNode.value);
  if (!key) return undefined;
  return [key, textChildren[1]?.value.trim() ?? ''];
};

const collectEntries = (
  drawer: OrgNode | undefined
): Record<string, string> => {
  if (!drawer) return {};
  const entries: Record<string, string> = {};
  drawer.childrenList
    .filter((n) => n.is(NodeType.Property))
    .forEach((property) => {
      const entry = readPropertyEntry(property);
      if (entry) entries[entry[0]] = entry[1];
    });
  return entries;
};

export const createProperties = (headline: OrgNode): OrgProperties => ({
  get entries() {
    return collectEntries(findPropertyDrawer(headline));
  },
  get: (key) => {
    return collectEntries(findPropertyDrawer(headline))[key];
  },
  set: () => {
    throw new Error('OrgProperties.set is not implemented in v1');
  },
  remove: () => {
    throw new Error('OrgProperties.remove is not implemented in v1');
  },
});
