import React, { ChangeEvent, useMemo, useState } from 'react';
import { WorkingPage } from '../src/components/dummy/working-page';
import { CenterH, Layout } from '../src/components/layout/layout';
import { PageTitle } from '../src/components/layout/page-title';
import { useAuthState } from '../src/components/hooks/use-auth-state';
import { useSingletons } from '../src/internal/app-context';
import { RenderPromiseEither } from '../src/components/hoc/render-promise-either';
import { FriendUser, UserFriendCollection } from '../src/model/friend';
import { Button, ButtonGroup, FormGroup, InputGroup, Label } from '@blueprintjs/core';
import { useVersionedMemo } from '../src/components/generic-hooks/use-versioned-memo';
import { PreJson } from '../src/dummy/pre-json';
import { useConcurrencyControl } from '../src/components/generic-hooks/use-concurrency-control';
import { fold } from 'fp-ts/lib/Either';

const FriendsPageSectionSelector: React.FC<{ current: 0 | 1 | 2; onChange(x: 0 | 1 | 2): void }> = ({
  current,
  onChange,
}) => {
  return (
    <CenterH>
      <ButtonGroup className="flex justify-around w-full sm:w-1/2">
        <Button active={current === 0} text="好友列表" onClick={() => onChange(0)} />
        <Button active={current === 1} text="我想要的" onClick={() => onChange(1)} />
        <Button active={current === 2} text="好友想要的" onClick={() => onChange(2)} />
      </ButtonGroup>
    </CenterH>
  );
};

const FriendListSection: React.FC = () => {
  const authedUser = useAuthState();
  const singletons = useSingletons();
  const [friendsP, refreshFriendList] = useVersionedMemo(() => singletons.friends.fetchFriendList(), [authedUser]);

  const [withLock, concurrency] = useConcurrencyControl(1);

  const [friendEmailO, setEmailOrNick] = useState('');
  const [comment, setComment] = useState('');

  return (
    <div>
      <FormGroup className="text-sm p-2 px-8 sm:w-1/2">
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
        {friends =>
          <PreJson value={friends} /> && (
            <ul>
              {friends.map((f, i) => (
                <li>
                  <div>
                    {f.userId} / {f.comment}
                  </div>
                </li>
              ))}
            </ul>
          )
        }
      </RenderPromiseEither>
    </div>
  );
};

const FriendsPageContent: React.FC = () => {
  const [section, setSection] = useState(0 as 0 | 1 | 2);

  return (
    <div>
      <FriendsPageSectionSelector current={section} onChange={setSection} />
      {section === 0 && <FriendListSection />}
      {section === 1 && null}
    </div>
  );
};

const FriendsPageResolved: React.FC<{ resolved: unknown[] }> = props => null;

const FriendsPage: React.FC = () => {
  return (
    <Layout>
      <PageTitle text="我的好友" />
      <hr className="my-2" />
      <FriendsPageContent />
    </Layout>
  );
};

export default FriendsPage;
