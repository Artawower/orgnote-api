import type { Ref } from 'vue';
import { Store } from './store';
import { PersonalInfo } from './user';
import { OAuthProvider } from './oauth-provider';

export interface AuthStore {
  token: Ref<string>;
  user: Ref<PersonalInfo>;
  provider: Ref<OAuthProvider>;
  auth: (params: {
    provider: string;
    environment?: string;
    redirectUrl?: string;
  }) => Promise<void>;

  authViaGithub: (redirectUrl: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyUser: () => Promise<void>;
  authUser: (u: PersonalInfo, token: string) => Promise<void>;
  subscribe: (token: string, email?: string) => Promise<void>;
  removeUserAccount: () => Promise<void>;
}

export type AuthStoreDefinition = Store<AuthStore>;
