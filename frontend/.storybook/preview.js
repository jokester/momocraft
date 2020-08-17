import { addParameters } from '@storybook/client-api';
import { addDecorator } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { withResponsiveViews } from 'storybook-addon-responsive-views';
import React, { Fragment } from 'react';
import { StoriesWrapper } from '../src/stories/stories-wrapper';

addParameters({
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
});

addDecorator((storyFn) => (
  <Fragment>
    {/**
     * wrap with Fragment to workaround strange issue in
     * @see https://github.com/vizeat/storybook-addon-responsive-views/issues/7
     */}
    <StoriesWrapper>{storyFn()}</StoriesWrapper>
  </Fragment>
));
addDecorator(withResponsiveViews);
