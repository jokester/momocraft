import { PageType } from '../src/next-types';
import { Layout } from '../src/components/layout/layout';
import { Button, H2, FormGroup, InputGroup } from '@blueprintjs/core';
import React, { useMemo, useState } from 'react';
import { useSingletons } from '../src/internal/app-context';
import { useLast, useObserved } from '../src/components/hooks/use-observed';
import { SelfUser } from '../src/model/user-identity';
import { ApiResponseSync, dummyAuthState } from '../src/service/all';
import { isLeft } from 'fp-ts/lib/Either';
import { createLogger } from '../src/util/debug-logger';

const onAuthResult = (res: ApiResponseSync<SelfUser>) => {
  if (isLeft(res)) {
    alert(res.left);
  } else {
    alert('登录成功');
  }
  return res;
};

const logger = createLogger(__filename);

const AuthState: React.FC = () => {
  const { auth } = useSingletons();
  const authState = useMemo(() => auth.authed, [auth]);

  const { self, pendingAuth } = useLast(authState, dummyAuthState);

  const wtf = useObserved(authState, dummyAuthState);

  const [email, setEmail] = useState('momocraft@gmail.com');
  const [password, setPass] = useState('1234567');

  logger('AuthState', self, pendingAuth, wtf);

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
      <FormGroup>
        <InputGroup
          type="text"
          value={email}
          leftIcon="envelope"
          onInput={ev => setEmail((ev.target as HTMLInputElement).value)}
        />
        <InputGroup
          type="password"
          value={password}
          leftIcon={'lock'}
          onInput={ev => setPass((ev.target as HTMLInputElement).value)}
        />
      </FormGroup>
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
