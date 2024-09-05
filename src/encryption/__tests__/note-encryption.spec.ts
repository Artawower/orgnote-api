import { expect, test } from 'vitest';
import { decryptNote, encryptNote } from '../note-encryption';
import { Note } from '../../models';
import {
  armoredPublicKey,
  armoredPrivateKey,
  privateKeyPassphrase,
} from './encryption-keys';
import { ModelsPublicNoteEncryptionTypeEnum } from '../../remote-api';

test('Should encrypt note content via password', async () => {
  const noteText = `#+ID: qweqwe

#+TITLE: Hello worlld

* Hello?`;

  const note: Note = {
    id: 'id',
    meta: {
      title: 'My note title',
      images: [],
      published: false,
      description: 'Awesome description',
    },
    author: {
      id: '1',
      name: 'John Doe',
      email: 'test@mail.com',
    },
  };

  const [encryptedNote, encryptedNoteText] = await encryptNote(note, {
    content: noteText,
    type: 'gpgPassword',
    password: '123',
    format: 'armored',
  });

  expect(encryptedNoteText.startsWith('-----BEGIN PGP MESSAGE-----')).toBe(
    true
  );
  expect(encryptedNote).toMatchSnapshot();
});

test('Should encrypt note content via password to binary format', async () => {
  const noteText = `#+ID: qweqwe

#+TITLE: Hello worlld

* Hello?`;

  const note: Note = {
    id: 'id',
    meta: {
      title: 'My note title',
      images: [],
      published: false,
      description: 'Awesome description',
    },
    author: {
      id: '1',
      name: 'John Doe',
      email: 'test@mail.com',
    },
  };

  const [encryptedNote, encryptedNoteText] = await encryptNote(note, {
    content: noteText,
    type: 'gpgPassword',
    password: '123',
    format: 'binary',
  });

  expect(encryptedNote).toMatchSnapshot();
  expect(encryptedNoteText).toBeInstanceOf(Uint8Array);
});

test('Should decrypt note content via password', async () => {
  const noteText = `-----BEGIN PGP MESSAGE-----

wy4ECQMI/CCaKMJEqy/gyROJeRgW9I738dDFBltFlxIjhxrN7nQ6gkX4GgX6
zt3v0mABvaBJA7corlU8su21TpPApOs/+DMWpVlbI3Zer7QfQK1fSBoSTbCR
2k3g68Afayke2nLkDNkH62tdOPiTkx7bSlp1zL4uU440IM1g6dC72JkmtoTJ
5Bjlwt4ZhxFsh+c=
=csID
-----END PGP MESSAGE-----`;

  const note: Note = {
    id: 'id',
    meta: {
      title: 'My note title',
      images: [],
      published: false,
      description: 'Awesome description',
    },
  };

  const decryptedNote = await decryptNote(note, {
    content: noteText,
    type: 'gpgPassword',
    password: '123',
  });

  expect(decryptedNote).toMatchSnapshot();
});

test('Should encrypt note via keys', async () => {
  const noteText = `#+ID: qweqwe
#+TITLE: Hello worlld

* Hello?`;

  const note: Note = {
    id: 'id',
    meta: {
      title: 'My note title for encryption via keys',
      images: [],
      published: false,
      description: 'Awesome description',
    },
    author: {
      id: '1',
      name: 'John Doe',
      email: 'test@mail.com',
    },
  };

  const [encryptedNote, encryptedNoteText] = await encryptNote(note, {
    content: noteText,
    type: ModelsPublicNoteEncryptionTypeEnum.GpgKeys,
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

test('Should decrypt note via provided keys', async () => {
  const encryptedNoteText = `-----BEGIN PGP MESSAGE-----

wcFMA/vryg+TTn0rAQ//TBFRjKmjRQoLhSrgeH+NbsZXbxvo7Ey4k+BQ9XA5
+CMpXH9uFUxsSaI5+McUSEt32VI17HRpXQDCL9nwaWqWOanMaRe0tXXhtox2
gfe2f/6zsge9ux+mXF2BG4z+V5T8XIOrfzxosVprdJHZHM3x7cW5USQ0t2i2
FiOUWxSZO1899J3yICpMvhDXvTLVZuKpSNQho5PyXSeZa83eN+uYkhgt9lsk
0KW88Nr435S6n6mVw/zpitXIgEKpkqh46mhG+1W3aC0lYx6j9lHm3bjtdb4r
2mtZbWKwfdBggEy8qEeiUeslvKd6uWtEccomzFgJkaqWVGknLmrBdHfztRIV
fbZhxHz+J3GFOIgXf/5+fv+zg0nTazgz1mDUfnTHw3+qcAyEJ0ADdyg9EZc+
bKbK0GwzMDPQeM+cCRDWUTiIa1ruyEETiwMdhWUDztF8XxY2o8jXPerZ0NhG
R8l+SvAdYQQXPfxEh9lA3thkyz/Vp72pW46lUeJHGSq/fS6KIdLHLP9Z2e1J
aCFpNMgyAN+BaXwnbLZfz6k5hV8awbRScSWQLEg69D9b287SFDPOYW7OZikn
CKXL7xyQ5LrWJZN9Z/UPGjy+PdEw1SBhyluW6DQ+Sz1j4K8USTLqY89EInDl
G7AxHGujR9UkUGyUvvc71XW7jEOogiDgn1ZMoj9Y58LSweUB8vfkY3VF84Fy
zGVvLFWnFbtnWuoQC4OOXv1F6ETdmEsSMEMWKzRLDGPyqNX7FhG3cejlEuiK
EsT5oQhz00RECmnR8mJkGmJhzWmmeoQvaucFqhTOZjvYl9ivuEMBZ2jtkdHn
R6UNcNZRpCbfnl7YoikqbGBgqDFYydFGHXKHDpYhcQYWJsMDUayzUiPtzmaE
tgfTgNNqgPxkLnWA99KYNU8DH+FwgaYBuw9dwdqwcjxSbZjHhCFGUfsqM+ik
O9gcoAwVO1usODlESU7OWuSF2tIv5DBG5rhlSyxBp4d4aWmaumTswAdojy2O
sM70ETbg0mC8niW9lNsgJp55oFmlksvzjUIit5rBEr55rtPcJSgakPpR2yvd
Q4XjybUmV0IdONMhk/OlqaBPtnA0RG+qTcm7oP1qH/m5zRA0ZplVQ5ylkQwr
LwGq5JQpJkgxxgLIrUbbtzYBShXSr5c1XXR0LIRiNgtb6s1s4mt+fbyExdJF
+ceuu+/xYrW/YTuEJpHxLiZ+aNPW5g5Y7Hbqu3hp3UL/kD44cc8JjZh18spX
p/ncojDhF2r2vhR+CndYcMkpGMV+t1pGKC8wlcFc7lb9GJASnqMGvhQmvIaG
gO/x7UjuTZSBW+kITHHZJDqYryKUv1j0CkHxIn9tWsYOpa1giOFtXX5v0AAM
AJR/s/beLlqwCsUdYnw1TkP/0u0ZK3RPio1nJ7S6ckPfsM7DqCWD8ILD8Cdr
cuzQrWaE30t5PXx53xBPO+6t5wKfDL35WHWG1Irmvz9UuT7tDS3IzwtF4ijF
PX6alTbxGnoHgZ4bG4J1wfpTNPppP1gJeVg67VqOypzdZi+SjofMWnFgRFmD
yEN8xpFUs7A9xryVZOosp9Sfe3IbBkO99sAQ7jV4EoMYk3/GKA==
=LjkG
-----END PGP MESSAGE-----`;

  const note: Note = {
    id: 'id',
    meta: {
      title: 'My note title for decryption via keys',
      images: [],
      published: false,
      description: 'Awesome description',
    },
  };

  const decryptedNote = await decryptNote(note, {
    content: encryptedNoteText,
    type: 'gpgKeys',
    publicKey: armoredPublicKey,
    privateKey: armoredPrivateKey,
    privateKeyPassphrase,
  });

  expect(decryptedNote).toMatchSnapshot();
});

test('Should not encrypt public note', async () => {
  const noteText = `#+ID: qweqwe
#+TITLE: Hello worlld

* Hello?`;

  const note: Note = {
    id: 'id',
    meta: {
      title: 'My note title',
      images: [],
      published: true,
      description: 'Awesome description',
    },
    author: {
      id: '1',
      name: 'John Doe',
      email: 'test@mail.com',
    },
  };

  const [encryptedNote, encryptedNoteText] = await encryptNote(note, {
    content: noteText,
    type: 'gpgPassword',
    password: '123',
    format: 'armored',
  });

  expect(encryptedNoteText.startsWith('-----BEGIN PGP MESSAGE-----')).toBe(
    false
  );
  expect(encryptedNote).toMatchSnapshot();
});

test('Should encrypt note with empty encrypted property', async () => {
  const noteText = `#+ID: qweqwe
#+TITLE: Hello worlld

* Hello?`;

  const note: Note = {
    id: 'id',
    meta: {
      title: 'My note title',
      images: [],
      published: false,
      description: 'Awesome description',
    },
    author: {
      id: '1',
      name: 'John Doe',
      email: 'test@mail.com',
    },
  };

  const [encryptedNote, encryptedNoteText] = await encryptNote(note, {
    content: noteText,
    type: 'gpgPassword',
    password: '123',
    format: 'armored',
  });

  expect(encryptedNoteText.startsWith('-----BEGIN PGP MESSAGE-----')).toBe(
    true
  );

  expect(encryptedNote).toMatchSnapshot();
});

test('Should not decrypt note without provided encrypted type', async () => {
  const noteText = `#+ID: qweqwe
#+TITLE: Hello worlld

* Hello?`;
  const note: Note = {
    id: 'id',
    meta: {
      title: 'My note title',
      images: [],
      published: false,
      description: 'Awesome description',
    },
    encrypted: undefined,
    author: {
      id: '1',
      name: 'John Doe',
      email: 'test@mail.com',
    },
  };

  const decryptedInfo = await decryptNote(note, {
    content: noteText,
    type: 'gpgPassword',
    password: '123',
    format: 'armored',
  });

  expect(decryptedInfo).toMatchSnapshot();
});

test('Should decrypt note and note meta', async () => {
  const meta = {
    title: 'My note title',
    images: ['./image1.png'],
    published: false,
    description: 'Awesome description',
    fileTags: ['tag1', 'tag2'],
  };
  const note: Note = {
    id: 'id',
    meta: { ...meta },
  };

  const noteText = `#+TITLE: My note title
#+DESCRIPTION: Awesome description
#+PUBLISHED: false
#+FILETAGS: :tag1:tag2:

[[./image1.png]]

Hello world`;

  const [encryptedNote, encryptedNoteText] = await encryptNote(note, {
    content: noteText,
    type: 'gpgPassword',
    password: '123',
  });

  const [decryptedNote, decryptedNoteText] = await decryptNote(encryptedNote, {
    content: encryptedNoteText,
    type: 'gpgPassword',
    password: '123',
  });

  expect(decryptedNote.meta).toEqual(meta);
  expect(decryptedNoteText).toEqual(noteText);
});

test('Should set not encrypted status when params type does not provided', async () => {
  const note: Note = {
    id: 'id',
    meta: {
      title: 'My note title for decryption via keys',
      images: [],
      published: false,
      description: 'Awesome description',
    },
  };

  const noteText = `-----BEGIN PGP MESSAGE-----

wcFMA/vryg+TTn0rAQ//TBFRjKmjRQoLhSrgeH+NbsZXbxvo7Ey4k+BQ9XA5
+CMpXH9uFUxsSaI5+McUSEt32VI17HRpXQDCL9nwaWqWOanMaRe0tXXhtox2
gfe2f/6zsge9ux+mXF2BG4z+V5T8XIOrfzxosVprdJHZHM3x7cW5USQ0t2i2
FiOUWxSZO1899J3yICpMvhDXvTLVZuKpSNQho5PyXSeZa83eN+uYkhgt9lsk
0KW88Nr435S6n6mVw/zpitXIgEKpkqh46mhG+1W3aC0lYx6j9lHm3bjtdb4r
2mtZbWKwfdBggEy8qEeiUeslvKd6uWtEccomzFgJkaqWVGknLmrBdHfztRIV
fbZhxHz+J3GFOIgXf/5+fv+zg0nTazgz1mDUfnTHw3+qcAyEJ0ADdyg9EZc+
bKbK0GwzMDPQeM+cCRDWUTiIa1ruyEETiwMdhWUDztF8XxY2o8jXPerZ0NhG
R8l+SvAdYQQXPfxEh9lA3thkyz/Vp72pW46lUeJHGSq/fS6KIdLHLP9Z2e1J
aCFpNMgyAN+BaXwnbLZfz6k5hV8awbRScSWQLEg69D9b287SFDPOYW7OZikn
CKXL7xyQ5LrWJZN9Z/UPGjy+PdEw1SBhyluW6DQ+Sz1j4K8USTLqY89EInDl
G7AxHGujR9UkUGyUvvc71XW7jEOogiDgn1ZMoj9Y58LSweUB8vfkY3VF84Fy
zGVvLFWnFbtnWuoQC4OOXv1F6ETdmEsSMEMWKzRLDGPyqNX7FhG3cejlEuiK
EsT5oQhz00RECmnR8mJkGmJhzWmmeoQvaucFqhTOZjvYl9ivuEMBZ2jtkdHn
R6UNcNZRpCbfnl7YoikqbGBgqDFYydFGHXKHDpYhcQYWJsMDUayzUiPtzmaE
tgfTgNNqgPxkLnWA99KYNU8DH+FwgaYBuw9dwdqwcjxSbZjHhCFGUfsqM+ik
O9gcoAwVO1usODlESU7OWuSF2tIv5DBG5rhlSyxBp4d4aWmaumTswAdojy2O
sM70ETbg0mC8niW9lNsgJp55oFmlksvzjUIit5rBEr55rtPcJSgakPpR2yvd
Q4XjybUmV0IdONMhk/OlqaBPtnA0RG+qTcm7oP1qH/m5zRA0ZplVQ5ylkQwr
LwGq5JQpJkgxxgLIrUbbtzYBShXSr5c1XXR0LIRiNgtb6s1s4mt+fbyExdJF
+ceuu+/xYrW/YTuEJpHxLiZ+aNPW5g5Y7Hbqu3hp3UL/kD44cc8JjZh18spX
p/ncojDhF2r2vhR+CndYcMkpGMV+t1pGKC8wlcFc7lb9GJASnqMGvhQmvIaG
gO/x7UjuTZSBW+kITHHZJDqYryKUv1j0CkHxIn9tWsYOpa1giOFtXX5v0AAM
AJR/s/beLlqwCsUdYnw1TkP/0u0ZK3RPio1nJ7S6ckPfsM7DqCWD8ILD8Cdr
cuzQrWaE30t5PXx53xBPO+6t5wKfDL35WHWG1Irmvz9UuT7tDS3IzwtF4ijF
PX6alTbxGnoHgZ4bG4J1wfpTNPppP1gJeVg67VqOypzdZi+SjofMWnFgRFmD
yEN8xpFUs7A9xryVZOosp9Sfe3IbBkO99sAQ7jV4EoMYk3/GKA==
=LjkG
-----END PGP MESSAGE-----`;

  const decryptedNote = await decryptNote(note, {
    content: noteText,
    type: 'disabled',
  });

  expect(decryptedNote).toMatchSnapshot();
});

test('Should encrypt note to binary format', async () => {
  const noteText = `#+ID: qweqwe
#+TITLE: Hello worlld

* Hello?`;

  const note: Note = {
    id: 'id',
    meta: {
      title: 'My note title',
      images: [],
      published: false,
      description: 'Awesome description',
    },
    author: {
      id: '1',
      name: 'John Doe',
      email: 'test@mail.com',
    },
  };

  const [encryptedNote, encryptedNoteText] = await encryptNote(note, {
    content: noteText,
    type: 'gpgPassword',
    password: '123',
    format: 'binary',
  });

  expect(encryptedNoteText).toBeInstanceOf(Uint8Array);
  expect(encryptedNote).toMatchSnapshot();

  const [_, decryptedNoteText] = await decryptNote(encryptedNote, {
    content: encryptedNoteText,
    type: 'gpgPassword',
    password: '123',
  });

  expect(decryptedNoteText).toEqual(noteText);
});
