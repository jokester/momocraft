import React, { ChangeEvent, useCallback, useState } from 'react';
import { useSingletons } from '../../internal/app-context';
import { ApiResponseSync } from '../../services/api/api-convention';
import { UserProfileDto } from '../../services/api-generated/models';
import { isLeft } from 'fp-ts/lib/Either';
import { CenterH } from '../layout/layout';
import { Button, FormGroup, InputGroup, Label } from '@blueprintjs/core';
import { DiscordLoginButton, GoogleLoginButton } from './oauth-login-button';

export const FormWarning: React.FC = () => {
  return (
    <div className="inline-block w-2/3 md:w-1/2 leading-tight">
      <h2 className="font-semibold">注意</h2>
      <ul className="list-disc list-inside mt-2">
        <li>目前还没有密码找回等高级功能. 如忘记密码, 请用页面底部的邮箱联系管理员.</li>
      </ul>
    </div>
  );
};

export const LoginOrSignupForm: React.FC<{ pendingAuth: boolean }> = ({ pendingAuth }) => {
  const { auth, toaster } = useSingletons();
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');

  const onAuthResult = useCallback((res: ApiResponseSync<UserProfileDto>) => {
    if (isLeft(res)) {
      toaster.current.show({ intent: 'warning', message: `登录失败: ${res.left}` });
    } else {
      toaster.current.show({ intent: 'success', message: '登录成功' });
    }
    return res;
  }, []);

  return (
    <div>
      <CenterH className="mt-32">
        <form onSubmit={(ev) => ev.preventDefault()} className="text-sm">
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
      </CenterH>
      <CenterH>
        <DiscordLoginButton />
      </CenterH>
      <CenterH>
        <GoogleLoginButton />
      </CenterH>
    </div>
  );
};
