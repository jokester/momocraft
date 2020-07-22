import React, { useMemo, useState } from 'react';
import { Layout } from '../src/components/layout/layout';
import { PageTitle } from '../src/components/layout/page-title';
import { FriendListSection } from '../src/components/friends/friend-list-section';
import { FriendsPageSectionSelector } from '../src/components/friends/friends-page-tab-switch';
import { useResolvedFriendCollections } from '../src/components/hooks/use-friends-api';
import { RenderPromiseEither } from '../src/components/hoc/render-promise-either';
import { ItemsDatabaseV3, itemsDatabaseV3 } from '../src/items-db/dynamic-load-db';
import { RenderPromise } from '@jokester/ts-commonutil/lib/react/hoc/render-promise';
import { ItemColumnType } from '../src/model/item-id-def';
import { UserFriendCollectionDto } from '../src/services/api-generated/models';
import { defaultGetServerSideProps } from '../src/ssr/default-get-server-side-props';

const FriendsPageContent: React.FC = () => {
  const [section, setSection] = useState(1 as 0 | 1 | 2);

  return (
    <div>
      <FriendsPageSectionSelector current={section} onChange={setSection} />
      {section === 0 && <FriendListSection />}
      {section === 1 && <FriendsPageIWantSection />}
      {section === 2 && <FriendsPageFriendsWantSection />}
    </div>
  );
};

export const FriendCollections: React.FC<{
  itemsDb: ItemsDatabaseV3;
  friendCollections: UserFriendCollectionDto;
  friendSuffix: string;
}> = ({ friendCollections, itemsDb, friendSuffix }) => {
  return (
    <div className="m-4 p-2 bg-blue-100">
      <p className="mb-2 text-gray-900">
        {friendCollections.friend.userId} ({friendCollections.friend.comment}) {friendSuffix}
      </p>
      <ul className="text-sm pl-2">
        {friendCollections.friendCollections
          .map((_) => itemsDb.itemsMap.get(_.itemId)!)
          .filter(Boolean)
          .map((item) => (
            <li key={item.itemId}>
              {item.base[ItemColumnType.nameZhS]} / {item.base[ItemColumnType.nameJa]}
            </li>
          ))}
      </ul>
      <hr />
    </div>
  );
};

export const FriendsPageIWantSection: React.FC = (props) => {
  const x = useResolvedFriendCollections();
  return (
    <RenderPromiseEither promise={x}>
      {(resolved) => (
        <RenderPromise promise={itemsDatabaseV3}>
          {(itemsDb) => (
            <div>
              {resolved.friendsOwns.map((friendCollections) => (
                <FriendCollections
                  key={friendCollections.friend.userId}
                  itemsDb={itemsDb}
                  friendCollections={friendCollections}
                  friendSuffix="拥有:"
                />
              ))}
            </div>
          )}
        </RenderPromise>
      )}
    </RenderPromiseEither>
  );
};

export const FriendsPageFriendsWantSection: React.FC = (props) => {
  const x = useResolvedFriendCollections();
  return (
    <RenderPromiseEither promise={x}>
      {(resolved) => (
        <RenderPromise promise={itemsDatabaseV3}>
          {(itemsDb) => (
            <div>
              {resolved.friendWants.map((friendCollections) => (
                <FriendCollections
                  key={friendCollections.friend.userId}
                  itemsDb={itemsDb}
                  friendCollections={friendCollections}
                  friendSuffix="想要:"
                />
              ))}
            </div>
          )}
        </RenderPromise>
      )}
    </RenderPromiseEither>
  );
};

const FriendsPageResolved: React.FC<{ resolved: unknown[] }> = (props) => null;

const FriendsPage: React.FC = () => {
  return (
    <Layout>
      <PageTitle text="我的好友" />
      <hr className="my-2" />
      <FriendsPageContent />
    </Layout>
  );
};

export default FriendsPage;

export const getServerSideProps = defaultGetServerSideProps;
