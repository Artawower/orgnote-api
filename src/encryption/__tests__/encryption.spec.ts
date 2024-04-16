import {
  encryptViaKeys,
  decryptViaKeys,
  encryptViaPassword,
  decryptViaPassword,
  NoKeysProvided,
  NoPasswordProvided,
  IncorrectOrMissingPrivateKeyPasswordError,
} from '../encryption';
import { test, expect } from 'vitest';

import {
  armoredPublicKey,
  armoredPrivateKey,
  privateKeyPassphrase,
} from './encryption-keys';

test('Should encrypt text via keys', async () => {
  const res = await encryptViaKeys(
    'Hello world',
    armoredPublicKey,
    armoredPrivateKey,
    privateKeyPassphrase
  );

  expect(res.startsWith('-----BEGIN PGP MESSAGE-----')).toBeTruthy();
});

test('Should decrypt via provided keys', async () => {
  const decryptedMessage = await decryptViaKeys(
    `-----BEGIN PGP MESSAGE-----

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
    armoredPrivateKey,
    privateKeyPassphrase
  );
  expect(decryptedMessage).toEqual('Hello world');
});

test('Should encrypt via password', async () => {
  const password = 'test';
  const res = await encryptViaPassword('Hello world', password);

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

  expect(await decryptViaPassword(encryptedMsg, password)).toEqual(
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
    await decryptViaPassword(encryptedMsg, 'password');
  } catch (e) {
    expect(e).toBeInstanceOf(NoKeysProvided);
  }
});

test('Should raise IncorrectOrMissingPrivateKeyPasswordError error when incorrect armored key provided', async () => {
  const password = 'test';
  const encryptedMsg = `-----BEGIN PGP MESSAGE-----

wy4ECQMI6KFWGqyVV+DgYl0qUEeTe1kAdjkoR4FxFJxx+6QiOP+sZ6h7bn//
aGW80jwBXEQ7uTjT8akpOKiH7BIuhEUZIXh+vDveG0Uwf63s2dIklznAEo+E
5iO5mEqoXWXg6nAvNxciA56dKuI=
=B4Tc
-----END PGP MESSAGE-----
`;

  try {
    await decryptViaKeys(encryptedMsg, armoredPublicKey, privateKeyPassphrase);
  } catch (e) {
    expect(e).toBeInstanceOf(IncorrectOrMissingPrivateKeyPasswordError);
  }
});

test('Should raise NoPasswordProvided error when try to use keys instead of password', async () => {
  const encryptedMsg = `-----BEGIN PGP MESSAGE-----

wy4ECQMI6KFWGqyVV+DgYl0qUEeTe1kAdjkoR4FxFJxx+6QiOP+sZ6h7bn//
aGW80jwBXEQ7uTjT8akpOKiH7BIuhEUZIXh+vDveG0Uwf63s2dIklznAEo+E
5iO5mEqoXWXg6nAvNxciA56dKuI=
=B4Tc
-----END PGP MESSAGE-----
`;

  try {
    await decryptViaKeys(encryptedMsg, armoredPrivateKey, privateKeyPassphrase);
  } catch (e) {
    expect(e).toBeInstanceOf(NoPasswordProvided);
  }
});
