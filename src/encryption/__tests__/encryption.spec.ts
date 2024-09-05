import {
  encryptViaKeys,
  decryptViaKeys,
  encryptViaPassword,
  decryptViaPassword,
  NoKeysProvidedError,
  NoPasswordProvidedError,
  IncorrectOrMissingPrivateKeyPasswordError,
  encrypt,
  decrypt,
  _encryptViaKeys,
  armor,
  unarmor,
} from '../encryption';
import { test, expect } from 'vitest';

import {
  armoredPublicKey,
  armoredPrivateKey,
  privateKeyPassphrase,
} from './encryption-keys';
// import { armor } from 'openpgp';

test('Should encrypt text as armored message via keys', async () => {
  const res = await encryptViaKeys({
    content: 'Hello world',
    publicKey: armoredPublicKey,
    privateKey: armoredPrivateKey,
    privateKeyPassphrase: privateKeyPassphrase,
    format: 'armored',
  });

  expect(res.startsWith('-----BEGIN PGP MESSAGE-----')).toBeTruthy();
});

test('Should encrypt text via keys', async () => {
  const res = await encryptViaKeys({
    content: 'Hello world',
    publicKey: armoredPublicKey,
    privateKey: armoredPrivateKey,
    privateKeyPassphrase,
    format: 'armored',
  });

  expect(res.startsWith('-----BEGIN PGP MESSAGE-----')).toBeTruthy();
});

test('Should decrypt via provided keys', async () => {
  const decryptedMessage = await decryptViaKeys({
    content: `-----BEGIN PGP MESSAGE-----

wcFMA/vryg+TTn0rARAAhXuEjOHa856iCNVmdeIGHF+IEoeEwTc5tIcr6Lri
V6xs//3WnwVwUlyxYrum3yCpx8t5gyWTXFfTNH08VoVqPVP45fkk1H7jdC6Q
I+tHfn8nXZApdKQlMOku+XMXtRuqvOUQHutqHj4ka3qC+wGIPcOsy2TIoFsS
xauk13hMggmVHOdQkMzWA1QlxDcz6lFl86SvX18uc7H62s36gHxARmOLZfBd
nRFdnPgLKNOPGWb6QvYfvxiv03vGSsKlb0tIpwP1Ot0nyZax+yH9CJmIEni/
rW9Wu/Ph+PRcB2L9kp/X4Opol3RwJ0lI9ilTRw9+GGFipXhCmJcjPJC7WNIg
vg0/xVUjSmlxQQAZlC9/sefvoXjY0CP+h+djtoZsxLpN4P4iTO1reuoVD0iO
UwT9JCUR1uDEiNXvh6AmrLlH3ceBynJcBtHXAnx1vcgtY8oKKYBjsoTeEngg
P5w5ZXcceoPuYLe6g1YPsFECAgGF+e/QuZ9CCfUgr4o7nSteHQRShP2gXZzc
oHKR4tiV71VVGKzv0EYhCvVt9NGkxIklft9Lq4ZOXeT9QOnJ/7gRofX2veg2
TpBADPJ/JvBRcxGEe7KUpYb6Hjr5LRfPOBnH3NK1zMJlqgUHt4ZZSVPxfr9I
6hWwsKxizzQ9gwEnDMciUvtX1tMF8+NiH7B0Ho4QVLfSwcEBwsGjA0yq08I/
7jK5LGtM8T3xtIW7yZ2binWbAFL6rnbOXjtmI31m4OxCEHW4CVBAV3/lUZlT
1eCPXEk32h39nDZHExjSeiUcGevCek5RvIvkhlnURzdZ69/BdZN5hr6LEOAe
O3UtE9mpvyNFKK9NZsn+ckR1fxK1K4yUiX+dtLjL+x+B38EQE0gjA+ekpfUe
dv7XD/ZAny66mAcwMn+lQozabpeEaNYIY7D8QspCvZWOS+borK/PVRJkF6pT
ZBmKzI4mvzDTFsd7VguB7frpsb+agUvhXXAJEHWEE4ZR3vQa1sWEnmxyAdNp
H9UFoIhGf9mSPlbBTMKEcAJmqzEIrb6z4psmmt6oYLXDR8PCxxK+g0xdrmbO
Az//AD0eRm8XHCHpwGf8YYWrNHOidDYpgmJTy7qFUwknWS+t3NlkU3CsCR+j
i9Km3edjOwPpJtgI0LeRRqXs3eUhLQARC5nFePbRWnFSXPBuFxBVZyL9AYrS
KQn4dM1p4eTtsiEu1NaTzRtQNZAFHcJpZ8qAL67LHoNdFe/atpCdlyV3yur9
RvAA3cB7cj7wab3beX+cTqxdhpGePZh0TrNd3liV69FtbnYfeDrtUYIL1jfT
EJN3l+qpveimyX655RrgFX3DNGrVbbhpx+FDF9Ky9kqb2BJBTFKoCBxbf0dS
sniNAsC/t/k6ErG8NKNQsNh1aeN6plXnxeVi1vv6SvO2mwZRVvDNT1hg9Cyc
UO1Pw43TRLO50HgR9+ERNXL491TJA0aCj14oXwsm0Dtg6EOltX0GUDwcPjv6
6QMreKTATPLytbhCdPO+JOzObsptU/IlsQQWlMz8yKXwqyuN8z8SOaddJIHR
YQ==
=f4F1
-----END PGP MESSAGE-----
`,
    privateKey: armoredPrivateKey,
    privateKeyPassphrase,
  });
  expect(decryptedMessage).toEqual('Hello world');
});

test('Should encrypt via password', async () => {
  const password = 'test';
  const res = await encryptViaPassword({
    content: 'Hello world',
    password,
    format: 'armored',
  });

  expect(res.startsWith('-----BEGIN PGP MESSAGE-----')).toBeTruthy();
});

test('Should decrypt via password', async () => {
  const password = 'test';
  const encryptedMsg = `-----BEGIN PGP MESSAGE-----

wy4ECQMI6KFWGqyVV+DgYl0qUEeTe1kAdjkoR4FxFJxx+6QiOP+sZ6h7bn//
aGW80jwBXEQ7uTjT8akpOKiH7BIuhEUZIXh+vDveG0Uwf63s2dIklznAEo+E
5iO5mEqoXWXg6nAvNxciA56dKuI=
=B4Tc
-----END PGP MESSAGE-----
`;

  expect(await decryptViaPassword({ content: encryptedMsg, password })).toEqual(
    'Hello world'
  );
});

test('Should raise incorrect or missing private key error', async () => {
  const encryptedMsg = `-----BEGIN PGP MESSAGE-----

wcFMA/vryg+TTn0rARAAhXuEjOHa856iCNVmdeIGHF+IEoeEwTc5tIcr6Lri
V6xs//3WnwVwUlyxYrum3yCpx8t5gyWTXFfTNH08VoVqPVP45fkk1H7jdC6Q
I+tHfn8nXZApdKQlMOku+XMXtRuqvOUQHutqHj4ka3qC+wGIPcOsy2TIoFsS
xauk13hMggmVHOdQkMzWA1QlxDcz6lFl86SvX18uc7H62s36gHxARmOLZfBd
nRFdnPgLKNOPGWb6QvYfvxiv03vGSsKlb0tIpwP1Ot0nyZax+yH9CJmIEni/
rW9Wu/Ph+PRcB2L9kp/X4Opol3RwJ0lI9ilTRw9+GGFipXhCmJcjPJC7WNIg
vg0/xVUjSmlxQQAZlC9/sefvoXjY0CP+h+djtoZsxLpN4P4iTO1reuoVD0iO
UwT9JCUR1uDEiNXvh6AmrLlH3ceBynJcBtHXAnx1vcgtY8oKKYBjsoTeEngg
P5w5ZXcceoPuYLe6g1YPsFECAgGF+e/QuZ9CCfUgr4o7nSteHQRShP2gXZzc
oHKR4tiV71VVGKzv0EYhCvVt9NGkxIklft9Lq4ZOXeT9QOnJ/7gRofX2veg2
TpBADPJ/JvBRcxGEe7KUpYb6Hjr5LRfPOBnH3NK1zMJlqgUHt4ZZSVPxfr9I
6hWwsKxizzQ9gwEnDMciUvtX1tMF8+NiH7B0Ho4QVLfSwcEBwsGjA0yq08I/
7jK5LGtM8T3xtIW7yZ2binWbAFL6rnbOXjtmI31m4OxCEHW4CVBAV3/lUZlT
1eCPXEk32h39nDZHExjSeiUcGevCek5RvIvkhlnURzdZ69/BdZN5hr6LEOAe
O3UtE9mpvyNFKK9NZsn+ckR1fxK1K4yUiX+dtLjL+x+B38EQE0gjA+ekpfUe
dv7XD/ZAny66mAcwMn+lQozabpeEaNYIY7D8QspCvZWOS+borK/PVRJkF6pT
ZBmKzI4mvzDTFsd7VguB7frpsb+agUvhXXAJEHWEE4ZR3vQa1sWEnmxyAdNp
H9UFoIhGf9mSPlbBTMKEcAJmqzEIrb6z4psmmt6oYLXDR8PCxxK+g0xdrmbO
Az//AD0eRm8XHCHpwGf8YYWrNHOidDYpgmJTy7qFUwknWS+t3NlkU3CsCR+j
i9Km3edjOwPpJtgI0LeRRqXs3eUhLQARC5nFePbRWnFSXPBuFxBVZyL9AYrS
KQn4dM1p4eTtsiEu1NaTzRtQNZAFHcJpZ8qAL67LHoNdFe/atpCdlyV3yur9
RvAA3cB7cj7wab3beX+cTqxdhpGePZh0TrNd3liV69FtbnYfeDrtUYIL1jfT
EJN3l+qpveimyX655RrgFX3DNGrVbbhpx+FDF9Ky9kqb2BJBTFKoCBxbf0dS
sniNAsC/t/k6ErG8NKNQsNh1aeN6plXnxeVi1vv6SvO2mwZRVvDNT1hg9Cyc
UO1Pw43TRLO50HgR9+ERNXL491TJA0aCj14oXwsm0Dtg6EOltX0GUDwcPjv6
6QMreKTATPLytbhCdPO+JOzObsptU/IlsQQWlMz8yKXwqyuN8z8SOaddJIHR
YQ==
=f4F1
-----END PGP MESSAGE-----`;

  try {
    await decryptViaPassword({ content: encryptedMsg, password: 'password' });
  } catch (e) {
    expect(e).toBeInstanceOf(NoKeysProvidedError);
  }
});

test('Should raise IncorrectOrMissingPrivateKeyPasswordError error when incorrect armored key provided', async () => {
  const encryptedMsg = `-----BEGIN PGP MESSAGE-----

wy4ECQMI6KFWGqyVV+DgYl0qUEeTe1kAdjkoR4FxFJxx+6QiOP+sZ6h7bn//
aGW80jwBXEQ7uTjT8akpOKiH7BIuhEUZIXh+vDveG0Uwf63s2dIklznAEo+E
5iO5mEqoXWXg6nAvNxciA56dKuI=
=B4Tc
-----END PGP MESSAGE-----
`;

  try {
    await decryptViaKeys({
      content: encryptedMsg,
      publicKey: armoredPublicKey,
      privateKey: privateKeyPassphrase,
    });
  } catch (e) {
    expect(e).toBeInstanceOf(IncorrectOrMissingPrivateKeyPasswordError);
  }
});

test('Should raise NoPasswordProvidedError error when try to use keys instead of password', async () => {
  const encryptedMsg = `-----BEGIN PGP MESSAGE-----

wy4ECQMI6KFWGqyVV+DgYl0qUEeTe1kAdjkoR4FxFJxx+6QiOP+sZ6h7bn//
aGW80jwBXEQ7uTjT8akpOKiH7BIuhEUZIXh+vDveG0Uwf63s2dIklznAEo+E
5iO5mEqoXWXg6nAvNxciA56dKuI=
=B4Tc
-----END PGP MESSAGE-----
`;

  try {
    await decryptViaKeys({
      content: encryptedMsg,
      privateKey: armoredPrivateKey,
      privateKeyPassphrase,
    });
  } catch (e) {
    expect(e).toBeInstanceOf(NoPasswordProvidedError);
  }
});

test('Should encrypt and decrypt text by provided configs via password', async () => {
  const text = 'Hello world';
  const password = '123';

  const res = await encrypt({
    content: text,
    type: 'gpgPassword',
    password,
    format: 'armored',
  });

  expect(res.startsWith('-----BEGIN PGP MESSAGE-----')).toBeTruthy();

  const decryptedMessage = await decrypt({
    content: res,
    type: 'gpgPassword',
    password,
  });

  expect(decryptedMessage).toEqual(text);
});

test('Should encrypt and decrypt text by provided configs via keys', async () => {
  const text = 'Hello world';
  const res = await encrypt({
    content: text,
    type: 'gpgKeys',
    format: 'armored',
    publicKey: armoredPublicKey,
    privateKey: armoredPrivateKey,
    privateKeyPassphrase,
  });

  expect(res.startsWith('-----BEGIN PGP MESSAGE-----')).toBeTruthy();

  const decryptedMessage = await decrypt({
    content: res,
    type: 'gpgKeys',
    publicKey: armoredPublicKey,
    privateKey: armoredPrivateKey,
    privateKeyPassphrase,
    format: 'utf8',
  });

  expect(decryptedMessage).toEqual(text);
});

test('Should encrypt to binary and decrypt to format armored!', async () => {
  const text = 'Hello world';

  const res = await encrypt({
    content: text,
    type: 'gpgPassword',
    password: '123',
    format: 'binary',
  });

  expect(res).toBeInstanceOf(Uint8Array);

  const decryptedMessage = await decrypt({
    content: res,
    type: 'gpgPassword',
    format: 'utf8',
    password: '123',
  });

  expect(decryptedMessage).toEqual(text);
});

test('Should encrypt to binary and decrypt to binary format', async () => {
  const text = 'Hello world';

  const res = await encrypt({
    content: text,
    type: 'gpgPassword',
    password: '123',
    format: 'binary',
  });

  expect(res).toBeInstanceOf(Uint8Array);

  const decryptedMessage = await decrypt({
    content: res,
    type: 'gpgPassword',
    format: 'binary',
    password: '123',
  });

  expect(decryptedMessage.toString()).toMatchInlineSnapshot(
    `"72,101,108,108,111,32,119,111,114,108,100"`
  );
});

test('Should encrypt to armored text and decrypt as binary format', async () => {
  const text = 'Hello world';

  const res = await encrypt({
    content: text,
    type: 'gpgPassword',
    password: '123',
    format: 'armored',
  });

  expect(res).toBeTypeOf('string');

  const decryptedMessage = await decrypt({
    content: res,
    type: 'gpgPassword',
    format: 'binary',
    password: '123',
  });

  expect(decryptedMessage).toBeInstanceOf(Uint8Array);
});

test('Should armor and unarmor encrypted file', async () => {
  const content: Uint8Array = new Uint8Array([
    72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,
  ]);

  const armored = armor(content);

  expect(armored).toMatchInlineSnapshot(`
    "-----BEGIN PGP MESSAGE-----

    SGVsbG8gd29ybGQ=
    =7asC
    -----END PGP MESSAGE-----
    "
  `);

  const { text, data } = await unarmor(armored);

  expect(data).toEqual(content);
});
