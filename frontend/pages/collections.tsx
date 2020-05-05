import { PageType } from '../src/next-types';
import { Layout, CenterH } from '../src/components/layout/layout';
import { Button, H2, FormGroup, InputGroup, Label } from '@blueprintjs/core';
import React, { useState, ChangeEvent, useCallback } from 'react';
import { useSingletons } from '../src/internal/app-context';
import { ApiResponseSync } from '../src/service/api-convention';
import { isLeft } from 'fp-ts/lib/Either';
import { createLogger } from '../src/util/debug-logger';
import { HankoUser } from '../src/api/hanko-api';
import gravatarUrl from 'gravatar-url';
import { useAuthState } from '../src/components/hooks/use-auth-state';
import { useItemsDB } from '../src/components/hooks/use-items-db';
import { useCollectionList } from '../src/components/hooks/use-collections-api';
import { InventoryCard, InventoryCartListView } from '../src/components/inventory-list/inventory-card-list';
import { RenderPromiseEither } from '../src/components/hoc/render-promise-either';

const logger = createLogger(__filename);

const Title = () => <h2 className="text-xl font-semibold mt-4">我的收藏</h2>;

const CollectionsPageContent: React.FC = () => {
  const authed = useAuthState();

  const ownCollection = useCollectionList(null);

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
