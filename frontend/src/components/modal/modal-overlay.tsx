import React from 'react';

const classes = {
  overlay: 'absolute h-screen w-screen flex justify-center align-center top-0 left-0',
  frame: 'mx-auto my-auto',
} as const;

const inline = {
  frame: {
    height: '30%',
    width: '80%',
    maxWidth: '50vw',
  } as React.CSSProperties,
} as const;

export const ModalOverlay: React.FC<{ children?: React.ReactElement; onOverlayClick?(): void }> = (props) => {
  const overlayRef = React.createRef<HTMLDivElement>();
  return (
    (props.children && (
      <div
        ref={overlayRef}
        onClick={(ev) => {
          if (ev.target === overlayRef.current && props.onOverlayClick) props.onOverlayClick();
        }}
        className={classes.overlay}
      >
        {props.children}
      </div>
    )) ||
    null
  );
};

export const ModalFrame: React.FC = (props) => {
  return (
    <div className={classes.frame} style={inline.frame}>
      {props.children}
    </div>
  );
};
