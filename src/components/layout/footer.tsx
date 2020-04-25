import * as React from 'react';
import Link from 'next/link';
import { TypedRoutes } from '../../typed-routes';

export const Footer: React.FC = props => {
  return (
    <div className="h-8 px-4 shadow-md flex items-center justify-between bg-darkest flex-none">
      <span>Copyright 2019-</span>

      <Link href={TypedRoutes.about}>
        <a href={TypedRoutes.about}>About</a>
      </Link>
    </div>
  );
};
