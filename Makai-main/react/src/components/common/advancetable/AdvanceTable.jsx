import React from "react";
import PropTypes from "prop-types";
import SimpleBarReact from "simplebar-react";
import { Table } from "react-bootstrap";

const AdvanceTable = ({
  getTableProps,
  headers,
  page,
  prepareRow,
  headerClassName,
  bodyClassName,
  rowClassName,
  tableProps,
}) => {
  return (
    <SimpleBarReact>
      <Table {...getTableProps(tableProps)}>
        <thead className={headerClassName}>
          <tr>
            {headers.map((column, index) => (
              <th
                key={index}
                {...column.getHeaderProps(
                  column.getSortByToggleProps(column.headerProps)
                )}
              >
                {column.render("Header")}
                {column.canSort ? (
                  column.isSorted ? (
                    column.isSortedDesc ? (
                      <span className="sort desc" />
                    ) : (
                      <span className="sort asc" />
                    )
                  ) : (
                    <span className="sort" />
                  )
                ) : (
                  ""
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={bodyClassName}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={i} className={rowClassName} {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      key={index}
                      {...cell.getCellProps(cell.column.cellProps)}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </SimpleBarReact>
  );
};
AdvanceTable.propTypes = {
  hasNextPage: PropTypes.bool,
  hasPreviosPage: PropTypes.bool,
  getTableProps: PropTypes.func,
  pageCount: PropTypes.number,
  goToPage: PropTypes.func,
  headerClassName: PropTypes.string,
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      Cell: PropTypes.func.isRequired,
      Footer: PropTypes.func.isRequired,
      accessor: PropTypes.func.isRequired,
      Headers: PropTypes.string,
      depth: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      minWidth: PropTypes.number.isRequired,
      maxWidth: PropTypes.number.isRequired,
      sortType: PropTypes.string.isRequired,
      originalWidth: PropTypes.number.isRequired,
      isVisible: PropTypes.bool.isRequired,
      totalVisibleHeaderCount: PropTypes.number.isRequired,
      totalLeft: PropTypes.number.isRequired,
      totalMinWidth: PropTypes.number.isRequired,
      totalWidth: PropTypes.number.isRequired,
      totalMaxWidth: PropTypes.number.isRequired,
      totalFlexWidth: PropTypes.number.isRequired,
      isSorted: PropTypes.bool.isRequired,
      sortedIndex: PropTypes.number.isRequired,
    })
  ),
  nextPage: PropTypes.func,
  previousPage: PropTypes.func,
  prepareRow: PropTypes.func,
  page: PropTypes.arrayOf(
    PropTypes.shape({
      allCells: PropTypes.arrayOf(
        PropTypes.shape({
          column: PropTypes.shape({
            Cell: PropTypes.func.isRequired,
            Footer: PropTypes.func.isRequired,
            accessor: PropTypes.func.isRequired,
            Headers: PropTypes.string,
            depth: PropTypes.number.isRequired,
            id: PropTypes.string.isRequired,
            width: PropTypes.number.isRequired,
            minWidth: PropTypes.number.isRequired,
            maxWidth: PropTypes.number.isRequired,
            sortType: PropTypes.string.isRequired,
            originalWidth: PropTypes.number.isRequired,
            isVisible: PropTypes.bool.isRequired,
            totalVisibleHeaderCount: PropTypes.number.isRequired,
            totalLeft: PropTypes.number.isRequired,
            totalMinWidth: PropTypes.number.isRequired,
            totalWidth: PropTypes.number.isRequired,
            totalMaxWidth: PropTypes.number.isRequired,
            totalFlexWidth: PropTypes.number.isRequired,
            isSorted: PropTypes.bool.isRequired,
            sortedIndex: PropTypes.number.isRequired,
          }),
          getCellProps: PropTypes.func,
          render: PropTypes.func,
          row: PropTypes.shape({
            id: PropTypes.string.isRequired,
            original: PropTypes.shape({
              productName: PropTypes.string,
              productDescription: PropTypes.string,
              hourlyPrice: PropTypes.string,
              estimatedRentalTime: PropTypes.string,
              itemTotal: PropTypes.string,
            }).isRequired,
            index: PropTypes.number.isRequired,
            depth: PropTypes.number.isRequired,
            values: PropTypes.shape({
              productName: PropTypes.string,
              productDescription: PropTypes.string,
              hourlyPrice: PropTypes.string,
              estimatedRentalTime: PropTypes.string,
              itemTotal: PropTypes.string,
            }).isRequired,
            togleRowSelected: PropTypes.func,
            isSelected: PropTypes.bool.isRequired,
            isSomeSelected: PropTypes.bool.isRequired,
            getRowProps: PropTypes.func,
            getToggleRowSelectedProps: PropTypes.func,
          }),
          value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        })
      ),
      cells: PropTypes.arrayOf(
        PropTypes.shape({
          column: PropTypes.shape({
            Cell: PropTypes.func.isRequired,
            Footer: PropTypes.func.isRequired,
            accessor: PropTypes.func.isRequired,
            Headers: PropTypes.string,
            depth: PropTypes.number.isRequired,
            id: PropTypes.string.isRequired,
            width: PropTypes.number.isRequired,
            minWidth: PropTypes.number.isRequired,
            maxWidth: PropTypes.number.isRequired,
            sortType: PropTypes.string.isRequired,
            originalWidth: PropTypes.number.isRequired,
            isVisible: PropTypes.bool.isRequired,
            totalVisibleHeaderCount: PropTypes.number.isRequired,
            totalLeft: PropTypes.number.isRequired,
            totalMinWidth: PropTypes.number.isRequired,
            totalWidth: PropTypes.number.isRequired,
            totalMaxWidth: PropTypes.number.isRequired,
            totalFlexWidth: PropTypes.number.isRequired,
            isSorted: PropTypes.bool.isRequired,
            sortedIndex: PropTypes.number.isRequired,
          }),
          getCellProps: PropTypes.func,
          render: PropTypes.func,
          row: PropTypes.shape({
            id: PropTypes.string.isRequired,
            original: PropTypes.shape({
              productName: PropTypes.string,
              productDescription: PropTypes.string,
              hourlyPrice: PropTypes.string,
              estimatedRentalTime: PropTypes.string,
              itemTotal: PropTypes.string,
            }).isRequired,
            index: PropTypes.number.isRequired,
            depth: PropTypes.number.isRequired,
            values: PropTypes.shape({
              productName: PropTypes.string,
              productDescription: PropTypes.string,
              hourlyPrice: PropTypes.string,
              estimatedRentalTime: PropTypes.string,
              itemTotal: PropTypes.string,
            }).isRequired,
            togleRowSelected: PropTypes.func,
            isSelected: PropTypes.bool.isRequired,
            isSomeSelected: PropTypes.bool.isRequired,
            getRowProps: PropTypes.func,
            getToggleRowSelectedProps: PropTypes.func,
          }),
          value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        })
      ).isRequired,
      id: PropTypes.string.isRequired,
      original: PropTypes.shape({
        productName: PropTypes.string,
        productDescription: PropTypes.string,
        hourlyPrice: PropTypes.string,
        estimatedRentalTime: PropTypes.string,
        itemTotal: PropTypes.string,
      }).isRequired,
      index: PropTypes.number.isRequired,
      depth: PropTypes.number.isRequired,
      values: PropTypes.shape({
        productName: PropTypes.string,
        productDescription: PropTypes.string,
        hourlyPrice: PropTypes.string,
        estimatedRentalTime: PropTypes.string,
        itemTotal: PropTypes.string,
      }).isRequired,
      togleRowSelected: PropTypes.func,
      isSelected: PropTypes.bool.isRequired,
      isSomeSelected: PropTypes.bool.isRequired,
      getRowProps: PropTypes.func,
      getToggleRowSelectedProps: PropTypes.func,
    })
  ),
  bodyClassName: PropTypes.string,
  rowClassName: PropTypes.string,
  tableProps: PropTypes.shape({
    className: PropTypes.string,
  }).isRequired,
};

export default AdvanceTable;
