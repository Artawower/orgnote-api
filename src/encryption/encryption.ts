import {
  createMessage,
  decrypt as _decrypt,
  decryptKey,
  encrypt as _encrypt,
  readKey,
  readMessage,
  readPrivateKey,
} from 'openpgp';
import { ModelsPublicNoteEncryptionTypeEnum } from '../remote-api';
import {
  OrgNoteEncryption,
  OrgNotePasswordEncryption,
  WithDecryptionContent,
} from '../models/encryption';
import { OrgNoteGpgEncryption, WithEncryptionContent } from 'src/models';

export class IncorrectOrMissingPrivateKeyPasswordError extends Error {}
export class ImpossibleToDecryptWithProvidedKeysError extends Error {}
export class IncorrectEncryptionPasswordError extends Error {}
export class NoKeysProvidedError extends Error {}
export class NoPasswordProvidedError extends Error {}

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

const noSymmetricallyEncryptedSessionKeyErrorMsg =
  'Error decrypting message: No symmetrically encrypted session key packet found.';

const armoredTextNotTypePrivateKeyErrorMsg =
  'Armored text not of type private key';

const notPrivateKeyErrprMsg =
  'Error decrypting message: No public key encrypted session key packet found.';

export const encryptViaKeys = withCustomErrors(_encryptViaKeys);
export const encryptViaPassword = withCustomErrors(_encryptViaPassword);
export const decryptViaPassword = withCustomErrors(_decryptViaPassword);
export const decryptViaKeys = withCustomErrors(_decryptViaKeys);

export const encrypt = async <
  T extends WithEncryptionContent<OrgNoteEncryption>,
>(
  encryptionParams: T
): Promise<T['format'] extends 'binary' ? Uint8Array : string> => {
  if (
    !encryptionParams.type ||
    encryptionParams.type === ModelsPublicNoteEncryptionTypeEnum.Disabled
  ) {
    return encryptionParams.content as any;
  }

  const res = (encryptionParams.type ===
  ModelsPublicNoteEncryptionTypeEnum.GpgKeys
    ? await encryptViaKeys(encryptionParams)
    : await encryptViaPassword(encryptionParams)) as unknown as Promise<
    T['format'] extends 'binary' ? Uint8Array : string
  >;

  return res;
};

export const decrypt = async <
  T extends WithDecryptionContent<OrgNoteEncryption>,
>(
  decryptionParams: T
): Promise<T['format'] extends 'binary' ? Uint8Array : string> => {
  if (
    !decryptionParams.type ||
    decryptionParams.type === ModelsPublicNoteEncryptionTypeEnum.Disabled
  ) {
    return decryptionParams.content as any;
  }
  const decryptedNote = (decryptionParams.type ===
  ModelsPublicNoteEncryptionTypeEnum.GpgKeys
    ? await decryptViaKeys(decryptionParams)
    : await decryptViaPassword(decryptionParams)) as unknown as Promise<
    T['format'] extends 'binary' ? Uint8Array : string
  >;

  return decryptedNote;
};

async function _encryptViaPassword<
  T extends WithEncryptionContent<OrgNotePasswordEncryption>,
>({
  content,
  password,
  format = 'binary',
}: T): Promise<T['format'] extends 'binary' ? Uint8Array : string> {
  const message = await createMessage({
    text: content,
  });

  const encryptedMessage = await _encrypt({
    message,
    format: format as any,
    passwords: [password],
  });

  return encryptedMessage as Promise<
    T['format'] extends 'binary' ? Uint8Array : string
  >;
}

export async function _encryptViaKeys<
  T extends WithEncryptionContent<OrgNoteGpgEncryption>,
>({
  content,
  publicKey: armoredPublicKey,
  privateKey: armoredPrivateKey,
  privateKeyPassphrase,
  format = 'binary',
}: T): Promise<T['format'] extends 'binary' ? Uint8Array : string> {
  const publicKey = await readKey({ armoredKey: armoredPublicKey });

  const message = await createMessage({
    text: content,
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

  const encryptedMessage = await _encrypt({
    message,
    format: format as any,
    encryptionKeys: publicKey,
    signingKeys: privateKey,
  });

  return encryptedMessage as Promise<
    T['format'] extends 'binary' ? Uint8Array : string
  >;
}

async function _decryptViaPassword<
  T extends Omit<WithDecryptionContent<OrgNotePasswordEncryption>, 'type'>,
>({
  content,
  password,
  format = 'utf8',
}: T): Promise<T['format'] extends 'binary' ? Uint8Array : string> {
  const isArmoredContent = typeof content === 'string';

  const message = await (isArmoredContent
    ? readMessage({ armoredMessage: content })
    : readMessage({ binaryMessage: content }));

  const { data: decryptedText } = await _decrypt({
    message,
    format,
    passwords: password,
  });

  return decryptedText as Promise<
    T['format'] extends 'binary' ? Uint8Array : string
  >;
}

async function _decryptViaKeys<
  T extends Omit<WithDecryptionContent<OrgNoteGpgEncryption>, 'type'>,
>({
  privateKey: armoredPrivateKey,
  privateKeyPassphrase,
  content,
  format = 'utf8',
}: T): Promise<T['format'] extends 'binary' ? Uint8Array : string> {
  const encryptedPrivateKey = await readPrivateKey({
    armoredKey: armoredPrivateKey,
  });

  const privateKey = privateKeyPassphrase
    ? await decryptKey({
        privateKey: encryptedPrivateKey,
        passphrase: privateKeyPassphrase,
      })
    : encryptedPrivateKey;

  const isString = typeof content === 'string';
  const message = await (isString
    ? readMessage({ armoredMessage: content })
    : readMessage({ binaryMessage: content }));

  const { data: decryptedText } = await _decrypt({
    message,
    format,
    decryptionKeys: privateKey,
  });

  return decryptedText as Promise<
    T['format'] extends 'binary' ? Uint8Array : string
  >;
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
          armoredTextNotTypePrivateKeyErrorMsg,
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
      if (e.message === noSymmetricallyEncryptedSessionKeyErrorMsg) {
        throw new NoKeysProvidedError();
      }

      if (e.message === notPrivateKeyErrprMsg) {
        throw new NoPasswordProvidedError();
      }

      throw e;
    }
  };
}
