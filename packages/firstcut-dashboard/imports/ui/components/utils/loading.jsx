
import React from 'react';
import { Loader } from 'semantic-ui-react';

export default function Loading(props) {
  return (
    <Loader active inline="centered" size="big">
      { Meteor.user()
        && (
        <span>
          {' '}

        Your projects are loading...
          {' '}
        </span>
        )
    }
    </Loader>
  );
}
