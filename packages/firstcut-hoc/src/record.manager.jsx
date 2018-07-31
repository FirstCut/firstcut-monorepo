
import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { PubSub } from 'pubsub-js';
import { NotFound } from '/imports/ui/pages/404.jsx';

export default function withRecordManager(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      const save_subscription = PubSub.subscribe(props.save_event, this.saveRecord);
      const change_subscription = PubSub.subscribe(props.change_event, this.onChange);
      let record = this.props.seed_record;
      if (record.nestedStructuresToImmutables) {
        record = record.nestedStructuresToImmutables();
      }
      this.state = {
        record,
        validation_errors: {},
        save_subscription: save_subscription,
        change_subscription: change_subscription
      };
    }

    componentWillUnmount() {
      PubSub.unsubscribe(this.state.change_subscription);
      PubSub.unsubscribe(this.state.save_subscription);
    }

    onChange = (e, {name, value} = {}) => {
      this.setState((prevState, props)=> {
        let record = prevState.record.set(name, value);
        return {record};
      });
    }

    saveRecord = () => {
      let record = this.state.record;
      if (record.save) {
        const promise = record.save();
        promise.then((saved_record)=> {
          this._handleSaveSuccess(saved_record);
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
      this.setState((prevState, props)=> {
        const record = prevState.record;
        if (this.props.onSaveSuccess) {
          this.props.onSaveSuccess(record);
        }
        return {validation_errors: {}, record};
      });
    }

    _handleErrors = (err) => {
      this.setState((prevState, props)=> {
        const record = prevState.record;
        if (this.props.onSaveError) {
          this.props.onSaveError(err);
        }
        if(err.error === 'validation-error') {
          const errors = createNameToErrorMap(err);
          return {validation_errors: errors};
        }
      });
    }

    render() {
      if (!this.state.record) {
        return <NotFound />
      } else {
        return (
          <WrappedComponent
            onChange={this.onChange}
            record={this.state.record}
            errors={this.state.validation_errors}
            {...this.props}
           />
         )
      }
    }
  }
}

function createNameToErrorMap(err) {
  let errors = {};
  err.details.forEach((fieldError) => {
    let name = fieldError.name;
    if(!errors[name]) { errors[name] = []; }
    errors[name].push(fieldError.message);
  });
  return errors;
}
