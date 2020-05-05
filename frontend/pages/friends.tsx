import React, { useMemo } from 'react';
import { WorkingPage } from '../src/components/dummy/working-page';
import { Layout } from '../src/components/layout/layout';
import { PageTitle } from '../src/components/layout/page-title';
import { useAuthState } from '../src/components/hooks/use-auth-state';
import { useSingletons } from '../src/internal/app-context';
import { RenderPromiseEither } from '../src/components/hoc/render-promise-either';
import { UserFriendCollection } from '../src/model/friend';

const FriendsPageContent: React.FC = () => {
  const singletons = useSingletons();
  const authedUser = useAuthState();

  const friendsP = useMemo(() => singletons.friends.fetchFriendList(), [authedUser]);

  return (
    <RenderPromiseEither promise={friendsP}>
      {friends => <FriendsPageResolved resolved={friends} />}
    </RenderPromiseEither>
  );
};

const FriendsPageResolved: React.FC<{ resolved: UserFriendCollection[] }> = props => null;

const FriendsPage: React.FC = () => {
  return (
    <Layout>
      <PageTitle text="我的好友" />
      <hr className="my-2" /> <FriendsPageContent />
    </Layout>
  );
};

export default WorkingPage;
