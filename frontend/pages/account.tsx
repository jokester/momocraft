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

const logger = createLogger(__filename);

const AuthState: React.FC = () => {
  const { auth, toaster } = useSingletons();
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');

  const { user: self, pendingAuth } = useAuthState();

  const onAuthResult = useCallback((res: ApiResponseSync<HankoUser>) => {
    if (isLeft(res)) {
      toaster.current.show({ intent: 'warning', message: `登录失败: ${res.left}` });
    } else {
      toaster.current.show({ intent: 'success', message: '登录成功' });
    }
    return res;
  }, []);

  const content = self ? (
    <div>
      <p>
        <img className="h-64 w-64" src={gravatarUrl(self.email || 'user@example.com', { size: 320 })} />
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
  ) : (
    <form onSubmit={ev => ev.preventDefault()} className="text-sm">
      <FormGroup>
        <Label>
          邮箱
          <InputGroup
            type="text"
            value={email}
            name="auth-email"
            leftIcon="envelope"
            disabled={pendingAuth}
            onChange={(ev: ChangeEvent<HTMLInputElement>) => setEmail(ev.target.value)}
          />
        </Label>
        <Label>
          密码
          <InputGroup
            type="password"
            value={password}
            name="auth-password"
            leftIcon="lock"
            disabled={pendingAuth}
            onChange={(ev: ChangeEvent<HTMLInputElement>) => setPass(ev.target.value)}
          />
        </Label>
      </FormGroup>
      <FormGroup>
        <div className="flex justify-center">
          <Button
            large
            intent="primary"
            type="submit"
            onClick={() => auth.emailSignUp({ email, password }).then(onAuthResult)}
            disabled={pendingAuth}
          >
            注册
          </Button>
          <Button
            large
            className="ml-16"
            type="submit"
            onClick={() => auth.emailSignIn({ email, password }).then(onAuthResult)}
            disabled={pendingAuth}
          >
            登录
          </Button>
        </div>
      </FormGroup>
    </form>
  );

  return <CenterH className="mt-32">{content}</CenterH>;
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
