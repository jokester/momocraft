import { PageType } from '../src/next-types';
import { CenterH, Layout } from '../src/components/layout/layout';
import React, { Fragment } from 'react';
import { createLogger } from '../src/util/debug-logger';
import { useAuthState } from '../src/components/hooks/use-auth-state';
import { defaultGetServerSideProps } from '../src/ssr/default-get-server-side-props';
import { FormWarning, LoginOrSignupForm } from '../src/components/auth/login-form';
import { CurrentUser } from '../src/components/auth/current-user';

const logger = createLogger(__filename);

const AccountPageContent: React.FC = () => {
  const { user, pendingAuth } = useAuthState();

  return (
    <div className="pt-8">
      {(pendingAuth || !user) && (
        <Fragment>
          <CenterH>
            <LoginOrSignupForm pendingAuth={pendingAuth} />
          </CenterH>
          <hr className="my-8 " />
          <CenterH>
            <FormWarning />
          </CenterH>
        </Fragment>
      )}
      <CenterH>{user && <CurrentUser user={user} />}</CenterH>
    </div>
  );
};

const AccountPage: PageType = (props) => {
  return (
    <Layout>
      <AccountPageContent />
    </Layout>
  );
};

// AccountPage.getInitialProps = async ctx => ({ });

export default AccountPage;

export const getServerSideProps = defaultGetServerSideProps;
