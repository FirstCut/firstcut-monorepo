
import React from 'react';
import { Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

export default Buttons = {
  Download: DownloadButton,
  Delete: DeleteButton,
  AddNew: AddNewButton,
  Link: LinkButton,
  Edit: EditButton
}

function DownloadButton(props) {
  const onClick = (e) => {
    console.log(props.href);
    console.log(e);
  }
  return (
    <Button animated='vertical' {...props} positive onClick={onClick}>
      <Button.Content hidden>Download</Button.Content>
      <Button.Content visible>
        <Icon name='download' />
      </Button.Content>
    </Button>
  )
}

function DeleteButton(props) {
  return (
    <Button animated='vertical' {...props} negative>
      <Button.Content hidden>Delete</Button.Content>
      <Button.Content visible>
        <Icon name='trash' />
      </Button.Content>
    </Button>
  )
}

function AddNewButton(props) {
  return (
    <Button animated='vertical' {...props} positive>
      <Button.Content hidden>Add</Button.Content>
      <Button.Content visible>
        <Icon name='plus' />
      </Button.Content>
    </Button>
  )
}

function EditButton(props) {
  return (
    <Button animated='vertical' {...props}>
      <Button.Content hidden>Edit</Button.Content>
      <Button.Content visible>
        <Icon name='edit' />
      </Button.Content>
    </Button>
  )
}

function LinkButton(props) {
  const {path, ...rest} = props;
  return <Button as={Link} to={path} {...rest}/>;
}
