import React from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { AppContextHolder } from '../../internal/app-context';

export const Layout: React.FC = props => (
  <AppContextHolder>
    <div className="h-screen flex flex-col">
      <Header here={'HERE'} />
      <div className="flex-grow z-0 overflow-y-scroll">{/* */ props.children}</div>
      <Footer />
    </div>
  </AppContextHolder>
);

export const MainContent: React.FC = props => <div className="h-full">{props.children}</div>;
