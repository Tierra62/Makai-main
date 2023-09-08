import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import Flex from "components/common/Flex";
import { formatDate } from "../../utils/dateFormater";
import debug from "sabio-debug";
const _logger = debug.extend("LoySourceForm");

const LoyaltyPointsSourceTotal = (prop) => {
  const loyaltyPointSource = prop.loyaltyPointSource;
  _logger("hi", loyaltyPointSource);
  const createdUserName = `${
    loyaltyPointSource.createdBy?.firstName || "John"
  }`;
  const modifiedUserName = `${
    loyaltyPointSource.modifiedBy?.firstName || "John"
  }`;
  const dateCreated = formatDate(loyaltyPointSource.dateCreated);
  const dateModified = formatDate(loyaltyPointSource.dateModified);

  let dateExpire = null;
  if (
    loyaltyPointSource.dateExpire &&
    loyaltyPointSource.dateExpire !== "0001-01-01T00:00:00"
  ) {
    dateExpire = loyaltyPointSource.dateExpire.slice(0, 10);
    dateExpire = formatDate(dateExpire);
  }

  const keyId = `/admin/loyaltypointssource/${loyaltyPointSource.id}`;
  const navigate = useNavigate();
  const onEditBtn = (e) => {
    e.preventDefault();
    const sourceState = {
      state: { type: "LoyaltyPointSource_Edit", payload: loyaltyPointSource },
    };
    _logger("indicator from list", loyaltyPointSource);
    navigate(keyId, sourceState);
  };

  const onDeleteBtn = (e) => {
    e.preventDefault();
    prop.onDeleteBtnClicked(loyaltyPointSource);
  };
  return (
    <React.Fragment>
      <tr>
        {/* <td>
          <span>{loyaltyPointSource.id}</span>
        </td> */}
        <td>
          <Flex alignItems="center" className="position-relative">
            <div className="ms-3">
              <h5 className="mb-0 fw-semi-bold">
                {loyaltyPointSource.name}
                <br></br>
                {loyaltyPointSource.isExpired ? "(Expired)" : ""}
              </h5>
            </div>
          </Flex>
        </td>
        <td>
          <h5>{loyaltyPointSource.pointsAwarded}</h5>
        </td>
        <td>
          <p>{dateExpire ? <strong>{dateExpire}</strong> : ""}</p>
        </td>
        <td>
          <p>{dateCreated}</p>
        </td>
        <td>
          <p>{createdUserName} </p>
        </td>
        <td>
          <p>{dateModified}</p>
        </td>
        <td>
          <p>{modifiedUserName}</p>
        </td>
        <td>
          {loyaltyPointSource.isExpired ? (
            <Button
              variant="link"
              className=" text-center col-auto text-dark"
              disabled={true}
            >
              Expired
            </Button>
          ) : (
            <>
              <Button
                variant="link"
                className=" text-center col-auto"
                onClick={onEditBtn}
              >
                Edit
              </Button>
              <Button
                variant="link"
                className=" text-center col-auto text-danger"
                onClick={onDeleteBtn}
              >
                Delete
              </Button>
            </>
          )}
        </td>
      </tr>
    </React.Fragment>
  );
};

export default LoyaltyPointsSourceTotal;
LoyaltyPointsSourceTotal.propTypes = {
  loyaltyPointSource: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    pointsAwarded: PropTypes.number.isRequired,
    isDeleted: PropTypes.bool.isRequired,
    isExpired: PropTypes.bool.isRequired,
    dateExpire: PropTypes.string,
    dateCreated: PropTypes.string.isRequired,
    dateModified: PropTypes.string.isRequired,
    createdBy: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string.isRequired,
    }),
    modifiedBy: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string.isRequired,
    }),
  }),
};
