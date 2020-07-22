import React from 'react';
import { UserProfileDto } from '../../services/api-generated/models';
import { useSingletons } from '../../internal/app-context';
import gravatarUrl from 'gravatar-url';
import { Button } from '@blueprintjs/core';

export const CurrentUser: React.FC<{ user: UserProfileDto }> = ({ user }) => {
  const { auth } = useSingletons();
  return (
    user && (
      <div>
        <p>
          <img className="h-64 w-64" src={gravatarUrl(user.email || 'user@example.com', { size: 320 })} />
          {user.email}
        </p>
        <p>
          用户id: <span className="monospace">{user.userId}</span>
        </p>
        <br />
        <Button onClick={() => auth.signOut()}>退出登录</Button>
      </div>
    )
  );
};
