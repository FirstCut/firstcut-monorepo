
import React from 'react';
import PropTypes from 'prop-types';
import { Image, List, Grid, Item, Card } from 'semantic-ui-react'
import withMultisourceImage from './multisource.image.jsx';

export function ProfileItem(props) {
  const { profile } = props;
  const ProfileImage = withMultisourceImage(Item.Image);
  return (
    <Item.Group>
    <Item>
      <ProfileImage size='tiny' src={profile.profilePicture} />
      <Item.Content>
        <Item.Header as='a'>{profile.fullName}</Item.Header>
        <Item.Meta>{profile.subheader}</Item.Meta>
        <Item.Description>
          <ProfileItems items={profile.items}/>
        </Item.Description>
        <Item.Extra>{profile.extra}</Item.Extra>
      </Item.Content>
    </Item>
    </Item.Group>
  )
}

export default function ProfileCard(props) {
  const { profile, ...rest } = props;
  const ProfileImage = withMultisourceImage(Item.Image);
  return (
    <Card.Group>
    <Card {...rest}>
      <Card.Content>
        <ProfileItem profile={profile} />
      </Card.Content>
      { profile.extra &&
      <Card.Content>
        <Card.Meta>{profile.extra}</Card.Meta>
      </Card.Content>
      }
    </Card>
    </Card.Group>
  )
}

const itemsProps = PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.string,
        icon: PropTypes.string,
      })
    )

ProfileCard.propTypes = {
  profile: PropTypes.shape({
    fullName: PropTypes.string,
    subheader: PropTypes.string,
    profilePicture: PropTypes.string,
    extra: PropTypes.string,
    items: itemsProps
  })
}

function ProfileItems(props) {
  const {items} = props;
  return (
    <List>
      {items.map((item, i)=><ListItem key={`item-${i}`} {...item}/>)}
    </List>
  )
}

function ListItem(props) {
  const {icon, content} = props;
  return (
    <List.Item>
      <List.Icon name={icon} />
      <List.Content>{content}</List.Content>
    </List.Item>
  )
}
// export default class ProfileCard extends React.Component {
//   render() {
//     const { profile } = {...this.props};
//     const ProfileImage = withMultisourceImage(Item.Image);
//     return (
//       <Item.Group>
//       <Item>
//         <ProfileImage size='tiny' src={profile.profilePicture} />
//         <Item.Content>
//           <Item.Header as='a'>{profile.fullName}</Item.Header>
//           <Item.Meta>{profile.subheader}</Item.Meta>
//           <Item.Description>
//             <ProfileItems items={profile.items}/>
//           </Item.Description>
//           <Item.Extra>{profile.extra}</Item.Extra>
//         </Item.Content>
//       </Item>
//       </Item.Group>
//     )
//   }
// }
//
// const itemsProps = PropTypes.arrayOf(
//       PropTypes.shape({
//         content: PropTypes.string,
//         icon: PropTypes.string,
//       })
//     )
//
// ProfileCard.propTypes = {
//   profile: PropTypes.shape({
//     fullName: PropTypes.string,
//     subheader: PropTypes.string,
//     profilePicture: PropTypes.string,
//     extra: PropTypes.string,
//     items: itemsProps
//   })
// }
//
// function ProfileItems(props) {
//   const {items} = props;
//   return (
//     <List>
//       {items.map((item, i)=><ListItem key={`item-${i}`} {...item}/>)}
//     </List>
//   )
// }
//
// function ListItem(props) {
//   const {icon, content} = props;
//   return (
//     <List.Item>
//       <List.Icon name={icon} />
//       <List.Content>{content}</List.Content>
//     </List.Item>
//   )
// }
