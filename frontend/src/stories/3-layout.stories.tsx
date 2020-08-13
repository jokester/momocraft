import { Header, transitionTheme } from '../components/new-layout/header';
import React from 'react';
import { PropOf } from '@jokester/ts-commonutil/lib/react/util/prop-of';
import { Story, Meta } from '@storybook/react/types-6-0';

export default {
  title: 'new layout',
};

export const HeaderPreviewGreen = () => <Header themeClass={transitionTheme.variantG} />;
export const HeaderPreviewPink = () => <Header themeClass={transitionTheme.variantP} />;

const Template: Story<PropOf<typeof Header>> = (props) => <Header {...props} />;

export const H2 = Template.bind({});
H2.args = { themeClass: transitionTheme.variantP };
