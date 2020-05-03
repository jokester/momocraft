import * as React from 'react';
import Link from 'next/link';
import { TypedRoutes } from '../../typed-routes';
import { FontAwesomeIcon } from '../icon/fontawesome-icon';

export const Footer: React.FC = props => {
  return (
    <div className="h-8 px-4 shadow-md flex flex-wrap items-center justify-between flex-none bg-blue-100">
      {/*<span>Copyright 2020-</span>*/}

      <Link href={TypedRoutes.about}>
        <a href={TypedRoutes.about}>关于我们</a>
      </Link>
      <a href={TypedRoutes.others.contactStaff}>
        <FontAwesomeIcon iconName="fa-envelope" /> 联系管理员
      </a>
    </div>
  );
};
