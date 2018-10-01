
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Card, Segment, Header,
} from 'semantic-ui-react';
import { withRecordManager } from '/imports/ui/components/managers';
import { Record } from 'immutable';
import { Link } from 'react-router-dom';
import { PubSub } from 'pubsub-js';
import { asUSDollars } from 'firstcut-utils';
import { Autoform } from 'firstcut-react-autoform';
import { getRecordPath } from 'firstcut-retrieve-url';

export function asLink(WrappedComponent) {
  function Wrapped(props) {
    const { record, getPath } = props;
    let { path } = props;
    path = (getPath) ? getPath(record) : path;

    const onClick = (e) => {
      e.stopPropagation();
    };

    return (<WrappedComponent as={Link} to={path} {...props} onClick={onClick} />);
  }
  return Wrapped;
}

export function asLinkToRecord(WrappedComponent) {
  function Wrapped(props) {
    const { record, ...rest } = props;
    const Component = asLink(WrappedComponent);
    return (<Component path={getRecordPath(record)} {...rest} />);
  }
  return Wrapped;
}

export function withUpdateField(WrappedComponent) {
  function Wrapped(props) {
    const { record, field, onConfirmValue } = props;
    const changeEvent = `change.${field}`;
    const saveEvent = `save.${field}`;
    const onConfirm = (e) => {
      PubSub.publish(changeEvent, { name: field, value: onConfirmValue });
      PubSub.publish(saveEvent);
    };
    const WithManager = withRecordManager(WrappedComponent);
    return (
      <WithManager
        onConfirm={onConfirm}
        saveEvent={saveEvent}
        changeEvent={changeEvent}
        seedRecord={record}
        {...props}
      />
    );
  }

  return Wrapped;
}

export function asUpdateFieldsForm(WrappedComponent) {
  return function (props) {
    const {
      record, fields, saveEvent, overrides, ...rest
    } = props;
    const EditForm = withRecordManager(Autoform);
    const content = (
      <EditForm
        fields={fields}
        saveEvent={saveEvent}
        seedRecord={record}
        overrides={overrides}
      />
    );

    return (
      <WrappedComponent {...rest} content={content} />
    );
  };
}

export function UpdateFieldButton(props) {
  const {
    record, field, onConfirmValue, confirmModal, trigger,
  } = props;
  const ModalComponent = confirmModal;
  const TriggerComponent = trigger;
  const WithUpdateField = withUpdateField(ModalComponent);
  return (
    <WithUpdateField
      trigger={TriggerComponent}
      {...props}
    />
  );
}

UpdateFieldButton.propTypes = {
  record: PropTypes.instanceOf(Record),
  field: PropTypes.string,
  onConfirmValue: PropTypes.string,
  trigger: PropTypes.node,
  confirmModal: PropTypes.node,
};

export function USDollars(props) {
  return (
    <span>
      { asUSDollars(props.amount) }
    </span>
  );
}

export function SegmentWithHeader(props) {
  const { header, body, ...rest } = props;
  return (
    <Segment {...rest}>
      <Header>
        {' '}
        {header}
        {' '}
      </Header>
      <p>
        {body}
      </p>
    </Segment>
  );
}
