import { Account } from './account.model';
import { Profile } from './profile.model';

export interface Identity {
  account: IdentityAccount;
  scopes: string[];
  sandbox: boolean;
}

export interface IdentityAccount {
  connectedAccounts: Account[];
  profile: Profile;
  properties: {
    subject: string;
  };
}
