import React from 'react';
import Link from 'next/link';
import { TypedRoutes } from '../../typed-routes';

const SectionLink: React.FC<{ text: string; linkTo: string }> = props => {
  return (
    <Link href={props.linkTo}>
      <button className="p-2 bg-gray-400 m-2">{props.text}</button>
    </Link>
  );
};

export const Header: React.FC<{ here: string }> = props => (
  <div className="flex flex-none flex-wrap px-2 bg-gray-300 shadow-lg">
    <SectionLink text="物品列表" linkTo={TypedRoutes.items} />
    <SectionLink text="好友" linkTo={TypedRoutes.friends} />
    <SectionLink text="物品列表" linkTo={TypedRoutes.items} />
    <SectionLink text="我的帐号" linkTo={TypedRoutes.account} />
  </div>
);
