import React from 'react';
import classNames from 'classnames';
import { TailwindComponents } from '../../style/tailwind-component';

interface FontawesomeIconProps {
  /**
   * see for
   */
  iconName: string;
  large?: boolean;
  style?: React.CSSProperties;
}

export const FontAwesomeIcon = React.forwardRef<HTMLElement, FontawesomeIconProps>(
  ({ large, iconName, style }, ref) => {
    const className = classNames(
      'fas inline-block m-2 relative',
      {
        [TailwindComponents.icon.large]: large,
        [TailwindComponents.icon.normal]: !large,
      },
      iconName,
    );
    return <i className={className} style={{ ...style, zIndex: 50000 }} ref={ref} />;
  },
);
