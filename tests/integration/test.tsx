import { Category, Color, Dot } from '@drawbotics/react-drylus';
import React from 'react';

interface ComponentProps {
  /** @deprecated reason */
  someProp?: string;

  someOtherProp: number;
}

const Component = ({ someProp, someOtherProp }: ComponentProps) => {
  return (
    <div>
      {someProp}
      {someOtherProp}
    </div>
  );
};

export const Test = () => {
  return (
    <React.Fragment>
      <Dot color={Color.BLUE} category={Category.PRIMARY} />
      <Component someProp="" someOtherProp={1} />
    </React.Fragment>
  );
};
