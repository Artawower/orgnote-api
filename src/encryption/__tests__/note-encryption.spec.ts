import { expect, test } from 'vitest';
import { decryptNote, encryptNote } from '../note-encryption';
import {
  armoredPublicKey,
  armoredPrivateKey,
  privateKeyPassphrase,
} from './encryption-keys';
import { ModelsPublicNoteEncryptionTypeEnum } from '../../remote-api';
import { NoteInfo } from 'src/models';
import { faker } from '@faker-js/faker';

// Helper function to generate a NoteInfo object
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
  const noteText = faker.lorem.paragraphs();
  const note = generateNoteInfo();

  const [encryptedNote, encryptedNoteText] = await encryptNote(note, {
    content: noteText,
    type: ModelsPublicNoteEncryptionTypeEnum.GpgKeys,
    publicKey: armoredPublicKey, // Используем armoredPublicKey
    privateKey: armoredPrivateKey, // Используем armoredPrivateKey
    privateKeyPassphrase, // Используем privateKeyPassphrase
    format: 'armored',
  });

  expect(encryptedNoteText.startsWith('-----BEGIN PGP MESSAGE-----')).toBe(
    true
  );
  expect(encryptedNote).toMatchSnapshot();
});

test('Should decrypt note via keys', async () => {
  const encryptedNoteText = `-----BEGIN PGP MESSAGE-----
  ${faker.lorem.paragraphs()}
  -----END PGP MESSAGE-----`;

  const note = generateNoteInfo();

  const decryptedNote = await decryptNote(note, {
    content: encryptedNoteText,
    type: ModelsPublicNoteEncryptionTypeEnum.GpgKeys,
    publicKey: armoredPublicKey, // Используем armoredPublicKey
    privateKey: armoredPrivateKey, // Используем armoredPrivateKey
    privateKeyPassphrase, // Используем privateKeyPassphrase
  });

  expect(decryptedNote).toMatchSnapshot();
});
