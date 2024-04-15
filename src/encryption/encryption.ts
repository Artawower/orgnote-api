import {
  createMessage,
  decrypt,
  decryptKey,
  encrypt,
  readKey,
  readMessage,
  readPrivateKey,
} from 'openpgp';

export class IncorrectOrMissingPrivateKeyPasswordError extends Error {}
export class ImpossibleToDecryptWithProvidedKeysError extends Error {}
export class IncorrectEncryptionPasswordError extends Error {}

const noPrivateKeyPassphraseProvidedErrorMsg =
  'Error: Signing key is not decrypted.';
const incorrectPrivateKeyPassphraseErrorMsg =
  'Error decrypting private key: Incorrect key passphrase';
const decryptionKeyIsNotDecryptedErrorMsg =
  'Error decrypting message: Decryption key is not decrypted.';
const corruptedPrivateKeyErrorMsg = 'Misformed armored text';

const decriptionFailedErrorMsg =
  'Error decrypting message: Session key decryption failed.';
const incorrectEncryptionPasswordErrorMsg =
  'Error decrypting message: Modification detected.';

const noSymmetricallyEncryptedSessionKey =
  'Error decrypting message: No symmetrically encrypted session key packet found.';

export const encryptViaKeys = withCustomErrors(_encryptViaKeys);
export const encryptViaPassword = withCustomErrors(_encryptViaPassword);
export const decryptViaPassword = withCustomErrors(_decryptViaPassword);
export const decryptViaKeys = withCustomErrors(_decryptViaKeys);

async function _encryptViaPassword(
  text: string,
  password: string
): Promise<string> {
  const message = await createMessage({
    text,
  });

  const encryptedMessage = await encrypt({
    message,
    format: 'armored',
    passwords: [password],
  });

  return encryptedMessage.toString();
}

async function _encryptViaKeys(
  text: string,
  armoredPublicKey: string,
  armoredPrivateKey: string,
  privateKeyPassphrase?: string
): Promise<string> {
  const publicKey = await readKey({ armoredKey: armoredPublicKey });

  const message = await createMessage({
    text,
  });

  const encryptedPrivateKey = await readPrivateKey({
    armoredKey: armoredPrivateKey,
  });

  const privateKey = privateKeyPassphrase
    ? await decryptKey({
        privateKey: encryptedPrivateKey,
        passphrase: privateKeyPassphrase,
      })
    : encryptedPrivateKey;

  const encryptedMessage = await encrypt({
    message,
    format: 'armored',
    encryptionKeys: publicKey,
    signingKeys: privateKey,
  });

  return encryptedMessage.toString();
}

async function _decryptViaPassword(
  data: string,
  password: string
): Promise<string> {
  const message = await readMessage({ armoredMessage: data });

  const { data: decryptedText } = await decrypt({
    message,
    passwords: password,
  });

  return decryptedText.toString();
}

async function _decryptViaKeys(
  data: string,
  armoredPrivateKey: string,
  privateKeyPassword?: string
): Promise<string> {
  const encryptedPrivateKey = await readPrivateKey({
    armoredKey: armoredPrivateKey,
  });

  const privateKey = privateKeyPassword
    ? await decryptKey({
        privateKey: encryptedPrivateKey,
        passphrase: privateKeyPassword,
      })
    : encryptedPrivateKey;

  const message = await readMessage({ armoredMessage: data });

  const { data: decryptedText } = await decrypt({
    message,
    decryptionKeys: privateKey,
  });

  return decryptedText.toString();
}

function withCustomErrors<P extends unknown[], T>(
  fn: (...args: P) => Promise<T | never>
) {
  return async (...args: P): Promise<T> => {
    try {
      return await fn(...args);
    } catch (e: unknown) {
      if (!(e instanceof Error)) {
        throw e;
      }
      if (
        [
          noPrivateKeyPassphraseProvidedErrorMsg,
          incorrectPrivateKeyPassphraseErrorMsg,
          corruptedPrivateKeyErrorMsg,
          decryptionKeyIsNotDecryptedErrorMsg,
          noSymmetricallyEncryptedSessionKey,
        ].includes(e.message)
      ) {
        throw new IncorrectOrMissingPrivateKeyPasswordError(e.message);
      }
      if (e.message === decriptionFailedErrorMsg) {
        throw new ImpossibleToDecryptWithProvidedKeysError(e.message);
      }
      if (e.message === incorrectEncryptionPasswordErrorMsg) {
        throw new IncorrectEncryptionPasswordError();
      }
      throw e;
    }
  };
}
