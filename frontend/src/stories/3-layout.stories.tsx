import { Header } from '../components/new-layout/header';
import React, { useState } from 'react';
import { PropOf } from '@jokester/ts-commonutil/lib/react/util/prop-of';
import { Story, Meta } from '@storybook/react/types-6-0';
import { action } from '@storybook/addon-actions';

export default {
  title: 'new layout',
};

export const HeaderPreview = () => {
  return (
    <div>
      <Header />
    </div>
  );
};

const Template: Story<PropOf<typeof Header>> = (props) => <Header {...props} />;

export const H2 = Template.bind({});
H2.args = {};
