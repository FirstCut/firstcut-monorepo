
import React from 'react';
import { Image } from 'firstcut-ui';

function Header(props) {
  const logoStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '25px',
    marginLeft: '20px',
    marginTop: '20px',
  };
  return (
    <Image src="/marketplace.png" style={logoStyle} />
  );
}

export default Header;
