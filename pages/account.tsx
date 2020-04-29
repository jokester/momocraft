import { PageType } from '../src/next-types';
import { Layout } from '../src/components/layout/layout';
import { Button, H2, FormGroup, InputGroup } from '@blueprintjs/core';
import React, { useMemo, useState } from 'react';
import { useSingletons } from '../src/internal/app-context';
import { useLast, useObserved } from '../src/components/hooks/use-observed';
import { ApiResponseSync, dummyAuthState } from '../src/service/all';
import { isLeft } from 'fp-ts/lib/Either';
import { createLogger } from '../src/util/debug-logger';
import { HankoUser } from '../src/api/hanko-api';
import gravatarUrl from 'gravatar-url';

const onAuthResult = (res: ApiResponseSync<HankoUser>) => {
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

  const { user: self, pendingAuth } = useLast(authState, dummyAuthState);

  const wtf = useObserved(authState, dummyAuthState);

  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');

  logger('AuthState', self, pendingAuth, wtf);

  if (self) {
    return (
      <div>
        <H2>已登录</H2>
        <p>
          <img src={gravatarUrl(self.email || 'user@example.com', { size: 320 })} />
          {self.email}
        </p>
        <p>
          用户id: <span className="monospace">{self.userId}</span>
        </p>
        <br />
        <Button onClick={() => auth.signOut()} disabled={pendingAuth}>
          退出登录
        </Button>
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
          disabled={pendingAuth}
          onInput={ev => setEmail((ev.target as HTMLInputElement).value)}
        />
        <InputGroup
          type="password"
          value={password}
          leftIcon="lock"
          disabled={pendingAuth}
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
