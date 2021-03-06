import React from 'react';

export interface ExternalComponentProps {
  /** @deprecated */
  deprecatedProp?: string;

  /**
   * A prop
   * @private
   */
  acceptedProp: string;
}

// Local component definition and usage
interface ComponentProps extends ExternalComponentProps {
  someOtherProp: number;
}

const Component = ({ someOtherProp, deprecatedProp, acceptedProp }: ComponentProps) => {
  return (
    <div>
      {deprecatedProp}
      {acceptedProp}
      {someOtherProp}
    </div>
  );
};

export const Test = () => {
  return (
    <React.Fragment>
      <Component deprecatedProp="" acceptedProp="" someOtherProp={1} />
    </React.Fragment>
  );
};
