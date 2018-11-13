
import React from 'react';
import { Menu, Image } from 'semantic-ui-react';

function Header(props) {
  const menuProps = {
    style: { padding: '10px' },
    text: true,
    tabular: true,
    fluid: true,
  };
  const logoStyle = {
    width: '100px',
  };
  return (
    <Menu {...menuProps}>
      <Menu.Item>
        <Image src="/firstcut_logo.png" style={logoStyle} />
      </Menu.Item>
      <Menu.Item header>
        <i>MARKETPLACE</i>
      </Menu.Item>
    </Menu>
  );
}

export default Header;
