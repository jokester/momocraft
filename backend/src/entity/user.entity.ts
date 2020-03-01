import { Exclude } from 'class-transformer';

export class UserEntity {
  readonly userId: number;
  readonly email: string;

  @Exclude()
  readonly passwordHash: string;

  constructor(from: UserEntity) {
    this.userId = from.userId;
    this.email = from.email;
    this.passwordHash = from.passwordHash;
  }
}
