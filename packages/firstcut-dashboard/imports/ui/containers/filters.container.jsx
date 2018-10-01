
import React from 'react';
import Models from 'firstcut-models';
import { BaseModel, RecordWithSchemaFactory } from 'firstcut-model-base';

export default function withFilters(WrappedComponent) {
  return class extends React.PureComponent {
    constructor(props) {
      super(props);
      const { model } = props;
      this.state = { filter: getFreshFilter(props) };
    }

    setFilter = (filter) => {
      this.setState((prevState, props) => ({ filter }));
    }

    applyFilter = (e, { name, value }) => {
      const old_filter = this.state.filter;
      const new_filter = old_filter.set(name, value);
      this.setFilter(new_filter);
    }

    clearFilters = () => {
      const filter = getFreshFilter(this.props);
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
      );
    }
  };
}

function getFreshFilter(props) {
  const filter_record = buildFilterRecord(props);
  const initialFilter = props.initialFilter || {};
  return new filter_record(initialFilter);
}

function buildFilterRecord(props) {
  const { model, extendFilterSchema } = props;
  const filter_schema = model.schema.constructor.fromFields(model.schema, [...props.filterFields.flatten()]);
  if (extendFilterSchema) {
    filter_schema.extend(extendFilterSchema);
  }
  const filter_record = RecordWithSchemaFactory(BaseModel, filter_schema);
  filter_record.models = Models;
  return filter_record;
}
