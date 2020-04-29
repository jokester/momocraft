import { PageType } from '../src/next-types';
import { Layout } from '../src/components/layout/layout';
import { Button, H2, FormGroup } from '@blueprintjs/core';
import React, { useMemo, useState } from 'react';
import { useSingletons } from '../src/internal/app-context';
import { useLast } from '../src/components/hooks/use-observed';
import { fold } from 'fp-ts/es6/Option';
import { SelfUser } from '../src/model/user-identity';
import { ApiResponseSync, dummyAuthState } from '../src/service/all';
import { isLeft } from 'fp-ts/lib/Either';

const onAuthResult = (res: ApiResponseSync<SelfUser>) => {
  if (isLeft(res)) {
    alert(res.left);
  }
  return res;
};

const AuthState: React.FC = () => {
  const { auth } = useSingletons();
  const authState = useMemo(() => auth.authed, [auth]);

  const { self, pendingAuth } = useLast(authState, dummyAuthState);

  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');

  if (self) {
    return (
      <div>
        <H2>已登录</H2>
        <p>{self.userEmail}</p>
        <p>{self.nickname ?? '(nick not set)'}</p>
        <br />
        <Button onClick={() => auth.signOut()}>退出登录</Button>
      </div>
    );
  }

  return (
    <div>
      <H2>{pendingAuth ? '正在登录' : '未登录'}</H2>
      <FormGroup></FormGroup>
      <FormGroup>
        <Button
          onClick={() => email && password && auth.emailSignUp({ email, password }).then(onAuthResult)}
          disabled={pendingAuth}
        >
          注册
        </Button>
        <Button
          onClick={() => email && password && auth.emailSignIn({ email, password }).then(onAuthResult)}
          disabled={pendingAuth}
        >
          登录
        </Button>
      </FormGroup>
    </div>
  );
};

const AccountPageContent: React.FC = () => {
  return (
    <div>
      <H2>我的帐号</H2>
      <AuthState />
    </div>
  );
};

const AccountPage: PageType = props => {
  return (
    <Layout>
      <AccountPageContent />
    </Layout>
  );
};

// AccountPage.getInitialProps = async ctx => ({ });

export default AccountPage;
