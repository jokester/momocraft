import React, { ChangeEvent, useState } from 'react';
import { useAuthState } from '../hooks/use-auth-state';
import { useSingletons } from '../../internal/app-context';
import { useVersionedMemo } from '@jokester/ts-commonutil/react/hook/use-versioned-memo';
import { useConcurrencyControl } from '@jokester/ts-commonutil/react/hook/use-concurrency-control';
import { Button, FormGroup, InputGroup, Label } from '@blueprintjs/core';
import { fold } from 'fp-ts/lib/Either';
import { FriendUser } from '../../model/friend';
import { RenderPromiseEither } from '../hoc/render-promise-either';

export const FriendListSection: React.FC = () => {
  const authedUser = useAuthState();
  const singletons = useSingletons();
  const [friendsP, refreshFriendList] = useVersionedMemo(() => singletons.friends.fetchFriendList(), [authedUser]);

  const [withLock, concurrency] = useConcurrencyControl(1);

  const [friendEmailO, setEmailOrNick] = useState('');
  const [comment, setComment] = useState('');

  return (
    <div>
      <FormGroup className="p-2 px-8 sm:w-1/2">
        <Label>
          用户名或邮箱
          <InputGroup
            placeholder="xx"
            value={friendEmailO}
            onChange={(ev: ChangeEvent<HTMLInputElement>) => setEmailOrNick(ev.target.value)}
          />
        </Label>
        <Label>
          注释名称
          <InputGroup
            placeholder="xx"
            value={comment}
            onChange={(ev: ChangeEvent<HTMLInputElement>) => setComment(ev.target.value)}
          />
        </Label>
        <hr />
        <Button
          text="添加好友"
          loading={concurrency > 1}
          disabled={concurrency > 1}
          onClick={() =>
            withLock(async mounted => {
              const added = await singletons.friends.saveFriend({
                targetUserOrEmail: friendEmailO,
                comment: comment,
                requestMessage: '',
              });

              if (!mounted.current) return;

              fold(
                (l: string) => {
                  singletons.toaster.current.show({ intent: 'warning', message: `添加好友失败: ${l}` });
                },

                (r: FriendUser) => {
                  refreshFriendList();
                  singletons.toaster.current.show({ intent: 'success', message: `添加好友成功` });
                },
              )(added);
            })
          }
        />
      </FormGroup>
      <RenderPromiseEither promise={friendsP}>
        {friends => (
          <ul className="px-8 py-2 space-y-4">
            {friends.map((f, i) => (
              <li
                key={f.userId}
                className="flex justify-center items-center border border-solid border-blue-200 bg-blue-100 rounded-lg"
              >
                <img className="float-left w-32 h-32 inline-block" src={f.avatarUrl} />
                <div className="align-baseline w-64">
                  <p className="">
                    用户名: {f.userId} <span className="text-gray-600">({f.comment})</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </RenderPromiseEither>
    </div>
  );
};
