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
  sub: string;
  sid: string;
  tid: string;
}

export interface Account {
  profile: Profile;
  properties: {
    subject: string;
  };
  provider: string;
  identityProvider?: {
    ui: {
      label: string;
    }
  };
  passport?: any;
  loginHint: string;
}

export interface Profile {
  username: string;
  name: string;
  picture: string;
}
