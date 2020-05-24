export class ItemCollectionDto {
  itemId!: string;
  state!: number /* CollectionState */;
}

export class UserCollectionListDto {
  collections!: ItemCollectionDto[];
}
