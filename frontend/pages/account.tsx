import { PageType } from '../src/next-types';
import { Layout } from '../src/components/layout/layout';
import { Button, H2, FormGroup, InputGroup, Label } from '@blueprintjs/core';
import React, { useState, ChangeEvent } from 'react';
import { useSingletons } from '../src/internal/app-context';
import { ApiResponseSync } from '../src/service/api-convention';
import { isLeft } from 'fp-ts/lib/Either';
import { createLogger } from '../src/util/debug-logger';
import { HankoUser } from '../src/api/hanko-api';
import gravatarUrl from 'gravatar-url';
import { useAuthState } from '../src/components/hooks/use-auth-state';

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
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');

  const { user: self, pendingAuth } = useAuthState();

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
      <form onSubmit={ev => ev.preventDefault()}>
        <FormGroup>
          <Label>
            <InputGroup
              type="text"
              value={email}
              name="auth-email"
              leftIcon="envelope"
              disabled={pendingAuth}
              onChange={(ev: ChangeEvent<HTMLInputElement>) => setEmail(ev.target.value)}
            />
          </Label>
          <InputGroup
            type="password"
            value={password}
            name="auth-password"
            leftIcon="lock"
            disabled={pendingAuth}
            onChange={(ev: ChangeEvent<HTMLInputElement>) => setPass(ev.target.value)}
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
            type="submit"
            onClick={() => email && password && auth.emailSignIn({ email, password }).then(onAuthResult)}
            disabled={pendingAuth}
          >
            登录
          </Button>
        </FormGroup>
      </form>
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
