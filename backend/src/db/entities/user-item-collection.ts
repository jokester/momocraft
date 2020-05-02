import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserItemCollection {
  @PrimaryGeneratedColumn()
  userItemCollectionId!: number;

  @Column()
  @Index()
  userId!: string;

  @Column()
  @Index()
  itemId!: string;

  @Column()
  @Index()
  itemState!: string;

  constructor(init?: Omit<UserItemCollection, 'userItemCollectionId'>) {
    if (init) {
      this.itemId = init.itemId;
      this.userId = init.userId;
      this.itemState = init.itemState;
    }
  }
}
