
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon } from 'semantic-ui-react'
import { List, Record } from 'immutable';

export default class TableLayout extends React.Component {
  state = {
    sort_by_column: null,
    ascending: null
  }

  handleSort = clicked_column => () => {
    const { sort_by_column, data } = this.state;
    if (sort_by_column !== clicked_column) {
      this._setSortByColumn(clicked_column);
    } else {
      this._changeDirection();
    }
  }

  _changeDirection = () => {
    this.setState({
      ascending: (!this.state.ascending),
    })
  }

  _setSortByColumn = column => {
    this.setState({
      sort_by_column: column,
      ascending: true
    });
  }

  render() {
    const {rows, columns, onSelectRow, options} = this.props;
    const sorted_rows = this._getSortedRows();
    const { sort_by_column, ascending } = this.state;
    return (
      <Table celled padded selectable sortable>
        <HeaderRow columns={columns} handleSort={this.handleSort} sort_by_column={sort_by_column} ascending={ascending}/>
        <TableBody rows={sorted_rows} columns={columns} onSelectRow={onSelectRow} options={options}/>
      </Table>
      )
    }

  _getSortedRows = () => {
    const {rows} = this.props;
    const {sort_by_column, ascending} = this.state;
    let sorted = (sort_by_column)? _.sortBy(rows.toArray(), [sort_by_column]) : rows;
    if (!ascending) {
      sorted = sorted.reverse();
    }
    return sorted;
  }
}

TableLayout.propTypes = {
  rows: PropTypes.instanceOf(List),
  options: PropTypes.object,
  columns: PropTypes.arrayOf(
      PropTypes.shape({
      display: PropTypes.node,
      label: PropTypes.string,
      key: PropTypes.string
    })
  ),
};

function HeaderRow(props) {
  return (
    <Table.Header>
      <Table.Row>
        <HeaderCells {...props}/>
      </Table.Row>
    </Table.Header>
  )
}

function HeaderCells(props) {
  const {columns, handleSort, sort_by_column, ascending} = props;
  return columns.map((col, i)=> {
    let sorted = null;
    if (sort_by_column == col.key) {
      sorted = ascending ? 'ascending' : 'descending';
    }
    const react_key = `header-${i}`;
    return <Table.HeaderCell key={react_key} sorted={sorted} onClick={handleSort(col.key)}> {col.label}</Table.HeaderCell>
  });
}

function TableBody(props) {
  const {rows, ...row_props} = props;
  return (
    <Table.Body>
      {
        rows.map((row, i)=> {
          const react_key = `row-${i}`;
          return (<Row key={react_key} row={row} {...row_props}/>);
        })
      }
    </Table.Body>
  )
}

function Row(props) {
  const {row, columns, onSelectRow, options={}} = {...props};
  const extra_row_props = options.getRowProps ? options.getRowProps(row) : {};
  return (
    <Table.Row onContextMenu={onSelectRow(row)} onClick={onSelectRow(row)} {...extra_row_props}>
      {
        columns.map((col, i)=> {
          const react_key = `cell-${col.key}-${i}`;
          return (<Cell key={react_key} row={row} column={col} />);
        })
      }
    </Table.Row>
  )
}

function Cell(props) {
  const {row, column} = props;
  const {key} = column;
  const cell_empty = row[key] == null;
  let content =  React.cloneElement(column.display, {record: row, field: key});
  return (<Table.Cell> {content} </Table.Cell>);
}
