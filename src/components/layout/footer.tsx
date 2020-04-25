import * as React from 'react';
import Link from 'next/link';
import { TypedRoutes } from '../../typed-routes';

export const Footer: React.FC = props => {
  return (
    <div className="h-8 px-4 shadow-md flex flex-wrap items-center justify-between flex-none bg-gray-300">
      {/*<span>Copyright 2020-</span>*/}

      <Link href={TypedRoutes.about}>
        <a href={TypedRoutes.about}>About</a>
      </Link>
    </div>
  );
};
