import React from "react";
import PropTypes from "prop-types";
import { FaTrashAlt } from "react-icons/fa";
import { FaTrashRestoreAlt } from "react-icons/fa";

function FileTableRow(props) {
  const onDeleteClickLocal = (e) => {
    props.onDeleteClick(props.fileInfo, e);
  };

  const onReoverFileLocal = () => {
    props.recoverHandler(props.fileInfo);
  };

  return (
    <React.Fragment>
      <tr className="fs--1">
        <td>{props?.fileInfo?.name}</td>
        <td>{props?.fileInfo?.fileType?.name}</td>
        <td>{props?.fileInfo?.url}</td>
        <td>
          {props?.fileInfo?.firstName} {props?.fileInfo?.lastName}
        </td>
        <td>{props?.fileInfo?.id}</td>
        <td className="text-end">
          {!props?.isShowDeleted ? (
            <FaTrashAlt type="button" onClick={onDeleteClickLocal} />
          ) : (
            <FaTrashRestoreAlt
              type="button"
              className="mx-2"
              onClick={onReoverFileLocal}
            />
          )}
        </td>
      </tr>
    </React.Fragment>
  );
}

FileTableRow.propTypes = {
  fileInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    fileType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    id: PropTypes.number.isRequired,
    createdBy: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    isDeleted: PropTypes.bool.isRequired,
  }).isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  isShowDeleted: PropTypes.bool.isRequired,
  recoverHandler: PropTypes.func.isRequired,
};
export default FileTableRow;
