import * as React from 'react';
import Link from 'next/link';
import { TypedRoutes } from '../../typed-routes';

export const Footer: React.FC = props => {
  return (
    <div className="flex flex-row items-center justify-end pt-2 pb-1 px-4 shadow-md bg-blue-100 text-sm space-x-4 border-t border-solid border-blue-200">
      {/*<span>Copyright 2020-</span>*/}

      <Link href={TypedRoutes.index}>
        <a href={TypedRoutes.index}>首页</a>
      </Link>
      <Link href={TypedRoutes.about}>
        <a href={TypedRoutes.about}>关于</a>
      </Link>
      <a href={TypedRoutes.others.contactStaff} className="">
        联系管理员 (邮件)
      </a>
    </div>
  );
};
