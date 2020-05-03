import React from 'react';
import classNames from 'classnames';
import { TailwindComponents } from '../../style/tailwind-component';

interface FontawesomeIconProps {
  /**
   * see for
   */
  iconName: string;
  large?: boolean;
  small?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const FontAwesomeIcon = React.forwardRef<HTMLElement, FontawesomeIconProps>(
  ({ large, small, iconName, style, className }, ref) => {
    const _className = classNames(
      'fas inline-block relative',
      className || '',
      {
        [TailwindComponents.icon.large]: large,
        [TailwindComponents.icon.normal]: !(large || small),
        [TailwindComponents.icon.small]: small,
      },
      iconName,
    );
    return <i className={_className} style={{ ...style, zIndex: 50000 }} ref={ref} />;
  },
);
