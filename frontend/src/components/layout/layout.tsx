import React, { useRef } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { AppContextHolder } from '../../internal/app-context';
import { Toaster } from '@blueprintjs/core';

export const Layout: React.FC = props => {
  const toasterRef = useRef<Toaster>(null!);
  return (
    <AppContextHolder toasterRef={toasterRef}>
      <Toaster ref={toasterRef} position="bottom" />
      {/* root of "our" dom */}
      <div className="h-screen flex flex-col">
        <Header here={'HERE'} />
        <div className="flex-grow z-0 overflow-y-scroll">
          <div className="container mx-auto">{/* real ui */ props.children}</div>
        </div>
        <Footer />
      </div>
    </AppContextHolder>
  );
};

export const MainContent: React.FC = props => <div className="h-full">{props.children}</div>;
