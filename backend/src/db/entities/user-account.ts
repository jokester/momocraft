import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserAccount {
  @PrimaryGeneratedColumn()
  readonly userId!: number;

  @Column({ unique: true })
  readonly shortId!: string;

  constructor(init?: Pick<UserAccount, Exclude<keyof UserAccount, 'userId'>>) {
    if (init) {
      this.shortId = init.shortId;
    }
  }
}
