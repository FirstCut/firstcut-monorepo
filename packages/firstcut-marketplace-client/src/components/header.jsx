import React from 'react';
import { Image } from 'firstcut-ui';


/**
 * Header
 *
 * Header component for the app's layout. Displays the firstcut logo
 */

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
