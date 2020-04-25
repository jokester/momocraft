import React from 'react';
import { Header } from './header';
import { Footer } from './footer';

export const Layout: React.FC = props => (
  <div className="min-h-screen flex flex-col">
    <Header here={'HERE'} />
    <div className="flex-grow z-0">{props.children}</div>
    <Footer />
  </div>
);

export const MainContent: React.FC = props => <div className="h-full">{props.children}</div>;
