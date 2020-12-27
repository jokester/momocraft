import React, { useRef } from 'react';
import { Header as HeaderOld } from './header';
import { Footer } from './footer';
import classNames from 'classnames';
import { Header } from '../new-layout/header';

export const Layout: React.FC = (props) => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-grow z-0 overflow-y-scroll">
        <MainContent>{props.children}</MainContent>
      </div>
      <Footer />
    </div>
  );
};

export const MainContent: React.FC = (props) => <div className="container mx-auto">{props.children}</div>;

export const CenterH: React.FC<{ className?: string }> = (props) => {
  const containerClass = classNames('flex justify-center', props.className || '');
  return <div className={containerClass}>{props.children}</div>;
};
