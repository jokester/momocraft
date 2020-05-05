import { PageType } from '../src/next-types';
import { Layout } from '../src/components/layout/layout';
import React from 'react';
import { createLogger } from '../src/util/debug-logger';
import { useAuthState } from '../src/components/hooks/use-auth-state';
import { useCollectionList } from '../src/components/hooks/use-collections-api';
import { InventoryCard, InventoryCartListView } from '../src/components/inventory-list/inventory-card-list';
import { RenderPromiseEither } from '../src/components/hoc/render-promise-either';

const logger = createLogger(__filename);

const Title = () => <h2 className="text-xl font-semibold mt-4">我的收藏</h2>;

const CollectionsPageContent: React.FC = () => {
  const authed = useAuthState();

  const ownCollection = useCollectionList(authed.user?.userId || null);

  if (!authed.user) {
    return <div className="mt-24">需要登录</div>;
  }

  return (
    <div>
      <RenderPromiseEither promise={ownCollection}>
        {collections => (
          <InventoryCartListView>
            {collections.want.map((entry, i) => (
              <InventoryCard
                key={entry.itemId}
                item={collections.itemsMap.get(entry.itemId)!}
                collectionMap={collections}
                lazyLoad={false}
              />
            ))}
          </InventoryCartListView>
        )}
      </RenderPromiseEither>
    </div>
  );
};

const CollectionsPage: PageType = props => {
  return (
    <Layout>
      <Title />
      <hr className="my-2 " />
      <CollectionsPageContent />
    </Layout>
  );
};

export default CollectionsPage;
