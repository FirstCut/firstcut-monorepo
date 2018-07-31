
import React from 'react';
import { List, Record } from 'immutable';
import { BaseModel, Models } from 'firstcut-models';
import RecordWithSchemaFactory from 'firstcut-models';

export default function withFilters(WrappedComponent) {
  return class extends React.PureComponent {
    constructor(props) {
      super(props);
      const {model} = props;
      const filter_record = buildFilterRecord(props);
      this.state = {filter: new filter_record({})};
    }

    setFilter = (filter) => {
      this.setState((prevState, props)=> {
        return {filter};
      });
    }

    applyFilter = (e, {name, value})=> {
      let old_filter = this.state.filter;
      let new_filter = old_filter.set(name, value);
      this.setFilter(new_filter);
    }

    clearFilters = () => {
      const filter = this.state.filter.clear();
      this.setFilter(filter);
    }

    render() {
      return (
        <WrappedComponent
          applyFilter={this.applyFilter}
          clearFilters={this.clearFilters}
          filter={this.state.filter}
          {...this.props}
          />
        )
    }
  }
}

function buildFilterRecord(props) {
  const {model} = props;
  const filter_schema = model.schema.constructor.fromFields(model.schema, [...props.filter_fields.flatten()]);
  const filter_record = RecordWithSchemaFactory(BaseModel, filter_schema);
  filter_record.models = Models;
  return filter_record;
}
