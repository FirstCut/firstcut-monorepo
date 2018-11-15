
import React from 'react';
import { Image } from 'semantic-ui-react';

function Header(props) {
  const menuProps = {
    style: { padding: '10px' },
    text: true,
    tabular: true,
    fluid: true,
  };
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

// <Menu {...menuProps}>
//   <Menu.Item>
//   </Menu.Item>
//   <Menu.Item header>
//     <i>MARKETPLACE</i>
//   </Menu.Item>
// </Menu>
export default Header;
