import { Category, Color, Dot } from '@drawbotics/react-drylus';
import React from 'react';

export const Test = () => {
  return (
    <React.Fragment>
      <Dot color={Color.BLUE} category={Category.PRIMARY} />
    </React.Fragment>
  );
};
