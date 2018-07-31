
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'semantic-ui-react';
import { Record } from 'immutable';
import { HumanReadableDate } from '../utils/dates.jsx';
import Buttons from '../utils/buttons.jsx';
import { asLink, USDollars } from './utils.jsx';

function LinkCell(props) {
  const {record, field, ...rest} = props;
  const Cell = asLink(Button);
  return (<Cell {...props}> {record[field]} </Cell>);
}

// function VideographerProfileCell(props) {
//   const {record, field, getPath, ...rest} = props;
//   const profile = {
//     name: record.videographer.fullName,
//     avatar: record.videographer.profilePicture,
//     subheader: record.videographer.typeLabel
//   }
//   const LinkCard = asLink(Card);
//   return (
//     <LinkCard {...props}>
//       <Card.Content>
//         <Image floated='right' size='mini' src={profile.avatar} />
//         <Card.Header>
//         {profile.name}
//         </Card.Header>
//         <Card.Meta>
//           {profile.subheader}
//         </Card.Meta>
//       </Card.Content>
//     </LinkCard>
//   )
// }
//

class FetchAsync extends React.Component {
  state = {val: ''}

  componentDidMount() {
    const {func, ...rest } = this.props;
    this.props.func(rest, (err, val) => {
      if (val === true) {
        val = 'true';
      }
      if (val === false) {
        val = 'false';
      }
      this.setState({val});
    });
  }

  render() {
    const { func, record, field, ...rest } = this.props;
    return (<div {...rest}>{this.state.val}</div>)
  }
}

function BooleanValueCell(props) {
  const {record, field, ...rest} = props;
  return (<div {...rest}>{record[field]}</div>)
}

function PlainValueCell(props) {
  const {record, field, ...rest} = props;
  return (<div {...rest}>{record[field]}</div>)
}

function USDollarsCell(props) {
  const {record, field, ...rest} = props;
  return <USDollars amount={record[field]}/>
}

function DisplayDateCell(props) {
  const {record, field, ...rest} = props;
  return <HumanReadableDate date={record[field]} timezone={record.timezone} {...rest}/>;
}

export default Cells = Object.freeze({
  Link: LinkCell,
  DisplayDate: DisplayDateCell,
  PlainValue: PlainValueCell,
  Bool: BooleanValueCell,
  FetchAsync: FetchAsync,
  USDollars: USDollarsCell
});

Cells.propTypes = {
  record: PropTypes.instanceOf(Record),
  field: PropTypes.string,
  getPath: PropTypes.func
}
