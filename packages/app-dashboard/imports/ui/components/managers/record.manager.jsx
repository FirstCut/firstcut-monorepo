
import React from 'react';
import PropTypes from 'prop-types';
import { PubSub } from 'pubsub-js';
import { NotFound } from '/imports/ui/pages/404';
import Models from '/imports/api/models';
import { withFileManager } from '/imports/ui/components/managers';
import { inSimulationMode } from 'firstcut-user-session';

export default function withRecordManager(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      const { saveEvent, changeEvent, seedRecord } = props;
      const saveSubscription = PubSub.subscribe(saveEvent, this.saveRecord);
      const changeSubscription = PubSub.subscribe(changeEvent, this.onChange);
      let record = seedRecord;
      if (seedRecord.nestedStructuresToImmutables) {
        record = seedRecord.nestedStructuresToImmutables();
      }
      this.state = {
        record,
        validationErrors: {},
        saveSubscription,
        changeSubscription,
      };
    }

    componentWillUnmount() {
      PubSub.unsubscribe(this.state.changeSubscription);
      PubSub.unsubscribe(this.state.saveSubscription);
    }

    onChange = (e, { name, value } = {}) => {
      this.setState((prevState, props) => {
        const record = prevState.record.set(name, value);
        console.log(record);
        return { record };
      });
    }

    saveRecord = () => {
      const { record } = this.state;
      if (!inSimulationMode() && record.save) {
        const promise = record.save();
        promise.then((savedRecord) => {
          this._handleSaveSuccess(savedRecord);
        });
        promise.catch(this._handleErrors);
      } else if (record.schema && record.schema.validate) {
        try {
          record.schema.validate(record.toJS());
          this._handleSaveSuccess(record);
        } catch (err) {
          this._handleErrors(err);
        }
      }
    }

    _handleSaveSuccess = (record) => {
      this.setState((prevState, props) => {
        // const record = prevState.record;
        const { onSaveSuccess } = this.props;
        if (onSaveSuccess) {
          onSaveSuccess(record);
        }
        return { validationErrors: {}, record };
      });
    }

    _handleErrors = (err) => {
      this.setState((prevState, props) => {
        const { record } = prevState;
        const { onSaveError } = this.props;
        if (onSaveError) {
          onSaveError(err);
        }
        if (err.error === 'validation-error') {
          const errors = createNameToErrorMap(err);
          return { validationErrors: errors };
        }
      });
    }

    render() {
      const { record, validationErrors } = this.state;
      if (!record) {
        return <NotFound />;
      }
      return (
        <WrappedComponent
          onChange={this.onChange}
          withFileManager={withFileManager}
          record={record}
          models={Models}
          errors={validationErrors}
          {...this.props}
        />
      );
    }
  };
}

function createNameToErrorMap(err) {
  const errors = {};
  err.details.forEach((fieldError) => {
    const { name } = fieldError;
    if (!errors[name]) { errors[name] = []; }
    errors[name].push(fieldError.message);
  });
  return errors;
}
