import React from 'react';

// Local component definition and usage
interface ComponentProps {
  /** @deprecated reason */
  someProp?: string;

  /** @deprecated reason2 */
  someProp2?: string;

  someOtherProp: number;
}

const Component = ({ someProp, someOtherProp, someProp2 }: ComponentProps) => {
  return (
    <div>
      {someProp}
      {someOtherProp}
      {someProp2}
    </div>
  );
};

export const Test = () => {
  return (
    <React.Fragment>
      <Component someProp="" someProp2="" someOtherProp={1} />
    </React.Fragment>
  );
};
