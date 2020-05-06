import { Button, ButtonLink, Category, Dot, Icon } from '@drawbotics/react-drylus';
import React from 'react';

export const Test = () => {
  return (
    <React.Fragment>
      <ButtonLink category={Category.BRAND} leading={<Icon name="plus" />}>
        New lead
      </ButtonLink>
      <Button category={Category.BRAND}>
        <Dot />
      </Button>
    </React.Fragment>
  );
};
