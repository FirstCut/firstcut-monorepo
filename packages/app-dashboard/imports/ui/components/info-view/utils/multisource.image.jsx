
import React from 'react';
import PropTypes from 'prop-types';
import { Image, List, Grid, Item } from 'semantic-ui-react'

export default function withMultisourceImage(WrappedComponent) {
  return function(props) {
    const { src, ...rest } = props;
    const url = src || '/images/avatar.png';
    return (
      <WrappedComponent src={url} {...rest}/>
    )
  }
}
