import React from 'react';

// Local component definition and usage
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
      <Component someProp="" someOtherProp={1} />
    </React.Fragment>
  );
};
