import classNames from "classnames";
import React from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";
import {
  useTable,
  useSortBy,
  usePagination,
  useRowSelect,
  useGlobalFilter,
} from "react-table";

export const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, className, ...rest }, ref) => {
    const defaultRef = React.useRef();

    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <Form.Check
        type="checkbox"
        className={classNames("form-check fs-0 mb-0", className)}
      >
        <Form.Check.Input type="checkbox" ref={resolvedRef} {...rest} />
      </Form.Check>
    );
  }
);

const AdvanceTableWrapper = ({
  children,
  columns,
  data,
  isSortable,
  selection,
  selectionColumnWidth,
  isPaginated,
  perPage = 10,
}) => {
  const {
    getTableProps,
    headers,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    gotoPage,
    pageCount,
    state: { pageIndex, pageSize, selectedRowIds, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      disableSortBy: !isSortable,
      initialState: { pageSize: isPaginated ? perPage : data.length },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      if (selection) {
        hooks.visibleColumns.push((columns) => [
          {
            id: "selection",
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            ),
            headerProps: {
              style: {
                width: selectionColumnWidth,
              },
            },
            cellProps: {
              style: {
                width: selectionColumnWidth,
              },
            },
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]);
      }
    }
  );

  const recursiveMap = (children) => {
    return React.Children.map(children, (child) => {
      if (child.props?.children) {
        return React.cloneElement(child, {
          children: recursiveMap(child.props.children),
        });
      } else {
        if (child.props?.table) {
          return React.cloneElement(child, {
            ...child.props,
            getTableProps,
            headers,
            page,
            prepareRow,
            canPreviousPage,
            canNextPage,
            nextPage,
            previousPage,
            gotoPage,
            pageCount,
            pageIndex,
            selectedRowIds,
            pageSize,
            setPageSize,
            globalFilter,
            setGlobalFilter,
          });
        } else {
          return child;
        }
      }
    });
  };

  return <>{recursiveMap(children)}</>;
};

AdvanceTableWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      accessor: PropTypes.string.isRequired,
      Header: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      productName: PropTypes.string,
      productDescription: PropTypes.string,
      hourlyPrice: PropTypes.string,
      estimatedRentalTime: PropTypes.string,
      itemTotal: PropTypes.string,
    })
  ).isRequired,
  isSortable: PropTypes.bool,
  selection: PropTypes.string,
  selectionColumnWidth: PropTypes.string,
  isPaginated: PropTypes.bool,
  perPage: PropTypes.number,
  getToggleAllRowsSelectedProps: PropTypes.string,
  row: PropTypes.string,
};

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};

export default AdvanceTableWrapper;
