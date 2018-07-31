
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Segment, Header } from 'semantic-ui-react';
import { withRecordManager } from 'firstcut-models';
import { Record } from 'immutable';
import { Link } from 'react-router-dom';
import { PubSub } from 'pubsub-js';
import { asUSDollars } from 'firstcut-utils';
import { getRecordPath } from 'firstcut-retrieve-url';
import { Autoform } from 'firstcut-react-autoform';

export function asLink(WrappedComponent) {
  const onClick = (e)=> {
    e.stopPropagation();
  }
  return function(props) {
    const {record} = props;
    const path = (props.getPath) ? props.getPath(record) : props.path;
    return (<WrappedComponent as={Link} to={path} {...props} onClick={onClick} />)
  }
}

export function withUpdateField(WrappedComponent) {
  return function(props) {
    const {record, field, on_confirm_value} = props;
    const change_event = `change.${field}`;
    const save_event = `save.${field}`;
    const onConfirm = (e) => {
      PubSub.publish(change_event, {name: field, value: on_confirm_value});
      PubSub.publish(save_event);
    }
    const WithManager = withRecordManager(WrappedComponent);
    return (
      <WithManager
        onConfirm={onConfirm}
        save_event={save_event}
        change_event={change_event}
        seed_record={record}
        {...props}
        />
    )
  }
}

export function asUpdateFieldsForm(WrappedComponent) {
  return function(props) {
    const {record, fields, save_event, overrides, ...rest} = props;
    const EditForm = withRecordManager(Autoform);
    const content = (
          <EditForm
            fields={fields}
            save_event={save_event}
            seed_record={record}
            overrides={overrides}
            />
          )

    return (
      <WrappedComponent {...rest} content={content}/>
    )
  }
}

export function UpdateFieldButton(props) {
  const {record, field, on_confirm_value, confirm_modal, trigger} = props;
  const ModalComponent = confirm_modal;
  const TriggerComponent = trigger;
  const WithUpdateField = withUpdateField(ModalComponent);
  return (
    <WithUpdateField
      trigger={TriggerComponent}
      {...props}
    />
  )
}

UpdateFieldButton.propTypes = {
  record: PropTypes.instanceOf(Record),
  field: PropTypes.string,
  on_confirm_value: PropTypes.string,
  trigger: PropTypes.node,
  confirm_modal: PropTypes.node
}

export function USDollars(props) {
  return (<span>{ asUSDollars(props.amount) }</span>)
}

export function SegmentWithHeader(props) {
  const { header, body, ...rest } = props;
  return (
    <Segment {...rest}>
      <Header> {header} </Header>
      <p>{body}</p>
    </Segment>
  )
}
