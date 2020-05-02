import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['userId', 'itemId'])
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
