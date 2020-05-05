import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn({})
  createdAt!: Date;

  @UpdateDateColumn({})
  updatedAt!: Date;

  constructor(init?: Omit<UserItemCollection, 'userItemCollectionId' | 'createdAt' | 'updatedAt'>) {
    if (init) {
      this.itemId = init.itemId;
      this.userId = init.userId;
      this.itemState = init.itemState;
    }
  }
}
