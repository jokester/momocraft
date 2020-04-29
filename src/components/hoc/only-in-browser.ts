import { inBrowser, isDevBuild } from '../../config/build-env';
import React from 'react';

export const OnlyInBrowser: React.FC = props => {
  return (inBrowser ? props.children : null) as React.ReactElement;
};

export const OnlyInDevBuild: React.FC = props => {
  return (isDevBuild ? props.children : null) as React.ReactElement;
};
