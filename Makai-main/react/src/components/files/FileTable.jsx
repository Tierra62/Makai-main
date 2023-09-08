import React from "react";
import { Table, Col, Row, Container } from "react-bootstrap";
import PropTypes from "prop-types";
import FileTableRow from "./FileTableRow";

function NewTable(props) {
  //#region MAP FILES
  const mapFiles = (aFile) => {
    if (!props?.isShowDeleted) {
      return (
        <FileTableRow
          key={aFile.id + "FILE"}
          fileInfo={aFile}
          isShowDeleted={false}
          onDeleteClick={onDeleteClickTable}
          recoverHandler={onRecoverFileInTable}
        />
      );
    } else {
      return (
        <FileTableRow
          key={aFile.id + "FILE_DELETED"}
          fileInfo={aFile}
          isShowDeleted={true}
          onDeleteClick={onDeleteClickTable}
          recoverHandler={onRecoverFileInTable}
        />
      );
    }
  };
  //#endregion

  //#region DELETE HANDLER
  const onDeleteClickTable = (deleteClickFile) => {
    props.tableDeleteHandler(deleteClickFile);
  };
  //#endregion

  //#region RECOVER HANDLER
  const onRecoverFileInTable = (recoverClickFile) => {
    props.recoverHandler(recoverClickFile);
  };
  //#endregion

  return (
    <>
      <Container>
        <Col className="container rounded-1 mt-3">
          <Row className="rounded-1">
            <Table className="bg-white rounded-1 text-left fixed">
              <thead className="rounded-1">
                <tr className="fw-bold fs--5 rounded-1 bg-light">
                  <th>File Name</th>
                  <th>File Type</th>
                  <th>Url</th>
                  <th>Created By</th>
                  <th>File ID</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>{props.tableList.map(mapFiles)}</tbody>
            </Table>
          </Row>
        </Col>
      </Container>
    </>
  );
}

NewTable.propTypes = {
  tableList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      fileType: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      createdBy: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }).isRequired
  ),
  isShowDeleted: PropTypes.bool.isRequired,
  tableDeleteHandler: PropTypes.func.isRequired,
  recoverHandler: PropTypes.func.isRequired,
};

export default NewTable;
