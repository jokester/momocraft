import { ItemCollectionDto } from './collections.dto';

export class FriendUserDto {
  userId!: string;
  comment!: string;
  avatarUrl?: string;
  approvedAt!: number;
}

export class UserFriendCollectionDto {
  friend!: FriendUserDto;
  friendCollections!: ItemCollectionDto[];
}

export class UserFriendRequestDto {
  targetUserOrEmail!: string;
  comment!: string;
  requestMessage!: string;
}

export class FriendListDto {
  friends!: FriendUserDto[];
}

export class FriendCollectionsDto {
  friendCollections!: UserFriendCollectionDto[];
}
