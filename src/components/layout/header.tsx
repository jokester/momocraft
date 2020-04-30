import React from 'react';
import Link from 'next/link';
import { TypedRoutes } from '../../typed-routes';

const SectionLink: React.FC<{ text: string; linkTo: string }> = props => {
  return (
    <Link href={props.linkTo}>
      <button className="p-2 bg-gray-400 m-2 rounded-lg">{props.text}</button>
    </Link>
  );
};

export const Header: React.FC<{ here: string }> = props => (
  <div className="flex flex-none justify-end flex-wrap px-2 bg-blue-100 shadow-lg sticky z-10" style={{ top: 0 }}>
    <SectionLink text="首页" linkTo={TypedRoutes.index} />
    <SectionLink text="物品列表" linkTo={TypedRoutes.items.index} />
    <SectionLink text="好友" linkTo={TypedRoutes.friends} />
    <SectionLink text="我的帐号" linkTo={TypedRoutes.account} />
  </div>
);
