
import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { List } from 'immutable';
import { _ } from 'lodash';

export default class TableLayout extends React.Component {
  static defaultProps = { options: {}, onSelectRow: () => {} }

  state = {
    sortByColumn: null,
    ascending: null,
  }

  handleSort = clickedColumn => () => {
    const { sortByColumn } = this.state;
    console.log(sortByColumn);
    if (sortByColumn !== clickedColumn) {
      this._setSortByColumn(clickedColumn);
    } else {
      this._changeDirection();
    }
  }

  _changeDirection = () => {
    this.setState({
      ascending: (!this.state.ascending),
    });
  }

  _setSortByColumn = (column) => {
    this.setState({
      sortByColumn: column,
      ascending: true,
    });
  }

  _getSortedRows = () => {
    const { rows } = this.props;
    const { sortByColumn, ascending } = this.state;
    const getSortByValue = (r) => {
      if (typeof r.getSortByValue === 'function') {
        return r.getSortByValue();
      }
      return r.getSortByValue;
    };
    let sorted = (sortByColumn) ? _.sortBy(rows.toArray(), [getSortByValue]) : rows;
    if (!ascending) {
      sorted = sorted.reverse();
    }
    return sorted;
  }

  render() {
    const {
      columns, onSelectRow, options,
    } = this.props;
    const sortedRows = this._getSortedRows();
    const { sortByColumn, ascending } = this.state;
    return (
      <Table size="small" celled selectable sortable fixed compact>
        <HeaderRow
          columns={columns}
          handleSort={this.handleSort}
          sortByColumn={sortByColumn}
          ascending={ascending}
        />
        <TableBody
          rows={sortedRows}
          columns={columns}
          onSelectRow={onSelectRow}
          options={options}
        />
      </Table>
    );
  }
}

TableLayout.propTypes = {
  rows: PropTypes.instanceOf(List).isRequired,
  options: PropTypes.object,
  onSelectRow: PropTypes.func,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      display: PropTypes.node,
      label: PropTypes.string,
      key: PropTypes.string,
    }),
  ).isRequired,
};

function HeaderRow(props) {
  return (
    <Table.Header>
      <Table.Row>
        <HeaderCells {...props} />
      </Table.Row>
    </Table.Header>
  );
}

function HeaderCells(props) {
  const {
    columns, handleSort, sortByColumn, ascending,
  } = props;
  return columns.map((col, i) => {
    let sorted = null;
    if (sortByColumn === col.key) {
      sorted = ascending ? 'ascending' : 'descending';
    }
    const reactKey = `header-${i}`;
    return (
      <Table.HeaderCell key={reactKey} sorted={sorted} onClick={handleSort(col.key)}>
        {' '}
        {col.label}
      </Table.HeaderCell>
    );
  });
}

function TableBody(props) {
  const { rows, ...rowProps } = props;
  return (
    <Table.Body>
      {
        rows.map((row, i) => {
          const reactKey = `row-${i}`;
          return (<Row key={reactKey} row={row} {...rowProps} />);
        })
      }
    </Table.Body>
  );
}

function Row(props) {
  const {
    row, columns, onSelectRow, options = {},
  } = { ...props };
  const extraRowProps = options.getRowProps ? options.getRowProps(row) : {};
  return (
    <Table.Row onContextMenu={onSelectRow(row)} onClick={onSelectRow(row)} {...extraRowProps}>
      {
        columns.map((col, i) => {
          const reactKey = `cell-${col.key}-${i}`;
          return (<Cell key={reactKey} row={row} column={col} />);
        })
      }
    </Table.Row>
  );
}

function Cell(props) {
  const { row, column } = props;
  const { key } = column;
  const content = React.cloneElement(column.display, { record: row, field: key });
  return (
    <Table.Cell>
      {' '}
      {content}
      {' '}
    </Table.Cell>
  );
}
