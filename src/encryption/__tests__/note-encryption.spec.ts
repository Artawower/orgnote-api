import { expect, test } from 'vitest';
import { decryptNote, encryptNote } from '../note-encryption';
import {
  armoredPublicKey,
  armoredPrivateKey,
  privateKeyPassphrase,
} from './encryption-keys';
import { EncryptionType } from '../../models/encryption';
import { NoteInfo } from 'src/models';

const testNote: NoteInfo = {
  id: 'test-note-id',
  meta: {
    title: 'Test note',
    published: false,
  },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  touchedAt: '2024-01-01T00:00:00.000Z',
  filePath: ['/test/note.org'],
  isMy: true,
  bookmarked: false,
  encrypted: false,
};

test('Should encrypt note via keys', async () => {
  const noteText = '#+title: Test note\n\nBody text';

  const [encryptedNote, encryptedNoteText] = await encryptNote(testNote, {
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
  expect(encryptedNote.encrypted).toBe(true);
  expect(encryptedNote.id).toBe(testNote.id);
  expect(encryptedNote.meta.id).toBeUndefined();
});

test('Should decrypt note via keys', async () => {
  const noteText = '#+title: Test note\n\nBody text';

  const [, encryptedNoteText] = await encryptNote(testNote, {
    content: noteText,
    type: EncryptionType.GpgKeys,
    publicKey: armoredPublicKey,
    privateKey: armoredPrivateKey,
    privateKeyPassphrase,
    format: 'armored',
  });

  const [decryptedNote, decryptedText] = await decryptNote(
    { ...testNote, encrypted: true },
    {
      content: encryptedNoteText,
      type: EncryptionType.GpgKeys,
      publicKey: armoredPublicKey,
      privateKey: armoredPrivateKey,
      privateKeyPassphrase,
    }
  );

  expect(decryptedNote.encrypted).toBe(false);
  expect(decryptedNote.id).toBe(testNote.id);
  expect(decryptedNote.meta.title).toBe('Test note');
  expect(decryptedText).toBe(noteText);
});
