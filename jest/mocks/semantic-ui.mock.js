
import React from 'react';

const Sidebar = {
  Pushable: props => <div {...props} />,
};

const Button = props => <button {...props} />;
const Form = {
  Field: props => <input {...props} />,
};

export {
  Button,
  Sidebar,
  Form,
};
