import { beforeEach, expect, test } from 'vitest';
import { decryptNote, encryptNote } from '../note-encryption';
import {
  armoredPublicKey,
  armoredPrivateKey,
  privateKeyPassphrase,
} from './encryption-keys';
import { EncryptionType } from '../../models/encryption';
import { NoteInfo } from 'src/models';
import { faker } from '@faker-js/faker';

beforeEach(() => {
  faker.seed(1);
  faker.setDefaultRefDate(new Date('2024-01-01T00:00:00.000Z'));
});

function generateNoteInfo(overrides: Partial<NoteInfo> = {}): NoteInfo {
  return {
    id: faker.string.uuid(),
    meta: {
      title: faker.lorem.sentence(),
      images: faker.helpers.uniqueArray(() => faker.image.url(), 3),
      published: faker.datatype.boolean(),
      description: faker.lorem.paragraph(),
    },
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    touchedAt: faker.date.recent().toISOString(),
    deletedAt: faker.datatype.boolean()
      ? faker.date.recent().toISOString()
      : undefined,
    filePath: faker.helpers.uniqueArray(() => faker.system.filePath(), 2),
    isMy: faker.datatype.boolean(),
    author: faker.datatype.boolean()
      ? {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
        }
      : undefined,
    bookmarked: faker.datatype.boolean(),
    encrypted: faker.datatype.boolean(),
    ...overrides,
  };
}

test('Should encrypt note via keys', async () => {
  const noteText = '#+title: Test note\n\nBody text';
  const note = generateNoteInfo();
  note.meta.published = false;

  const [encryptedNote, encryptedNoteText] = await encryptNote(note, {
    content: noteText,
    type: EncryptionType.GpgKeys,
    publicKey: armoredPublicKey,
    privateKey: armoredPrivateKey,
    privateKeyPassphrase,
    format: 'armored',
  });

  expect(encryptedNoteText.startsWith('-----BEGIN PGP MESSAGE-----')).toBe(
    true
  );
  expect(encryptedNote).toMatchSnapshot();
});

test('Should decrypt note via keys', async () => {
  const noteText = '#+title: Test note\n\nBody text';
  const note = generateNoteInfo();
  note.meta.published = false;

  const [, encryptedNoteText] = await encryptNote(note, {
    content: noteText,
    type: EncryptionType.GpgKeys,
    publicKey: armoredPublicKey,
    privateKey: armoredPrivateKey,
    privateKeyPassphrase,
    format: 'armored',
  });

  const decryptedNote = await decryptNote(note, {
    content: encryptedNoteText,
    type: EncryptionType.GpgKeys,
    publicKey: armoredPublicKey,
    privateKey: armoredPrivateKey,
    privateKeyPassphrase,
  });

  expect(decryptedNote).toMatchSnapshot();
});
