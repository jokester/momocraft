interface UserMeta {
  userNick?: string;
  avatarUrl?: string;
  userId: string;
}

export interface SelfUser extends UserMeta {
  authToken: string;
  userEmail: string;
  isMaintainer: boolean;
}

export interface AnyUser extends UserMeta {}
