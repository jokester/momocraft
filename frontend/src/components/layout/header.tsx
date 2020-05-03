import React from 'react';
import Link from 'next/link';
import { TypedRoutes } from '../../typed-routes';
import { FontAwesomeIcon } from '../icon/fontawesome-icon';

const SectionLink: React.FC<{ text: string | React.ReactElement; linkTo: string }> = props => {
  return (
    <Link href={props.linkTo}>
      <button className="text-sm px-2 py-2 bg-blue-200 mx-2 my-2 rounded-lg">{props.text}</button>
    </Link>
  );
};

export const Header: React.FC<{ here: string }> = props => (
  <div className="flex flex-none justify-end flex-wrap px-0 bg-blue-100 shadow-lg sticky z-10 top-0">
    <SectionLink text="物品数据库" linkTo={TypedRoutes.items.index} />
    <SectionLink text="收藏" linkTo={TypedRoutes.collections} />
    <SectionLink text="好友" linkTo={TypedRoutes.friends} />
    <SectionLink text={<FontAwesomeIcon small iconName="fa-user" />} linkTo={TypedRoutes.account} />
  </div>
);
