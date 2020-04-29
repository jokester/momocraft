interface UserMeta {
  nickname?: string;
  avatarUrl?: string;
  userId: string;
}

export interface SelfUser extends UserMeta {
  // authToken: string;
  userEmail: string;
  isTrustedUser: boolean;
  isMaintainer: boolean;
}

export interface AnyUser extends UserMeta {}
