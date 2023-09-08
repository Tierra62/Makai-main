import React, { useState } from "react";
import PropTypes from "prop-types";
import Flex from "components/common/Flex";
import debug from "sabio-debug";
import { formatDate } from "../../utils/dateFormater";

const _logger = debug.extend("loyaltyPointsTotal");
const LoyaltyPointsTotal = (prop) => {
  const loyaltyPoint = prop.loyaltyPoint;
  const loyaltyPointDate = formatDate(loyaltyPoint.dateCreated);
  const loyaltyPointSource = loyaltyPoint.loyaltyPointSource;
  let dateExpire = null;
  if (
    loyaltyPointSource.dateExpire &&
    loyaltyPointSource.dateExpire !== "0001-01-01T00:00:00"
  ) {
    dateExpire = loyaltyPointSource.dateExpire.slice(0, 10);
    dateExpire = formatDate(dateExpire);
  }
  const redeemedPoint = loyaltyPointSource.pointsAwarded < 0;
  const [redeemed] = useState({
    true: "Redeemed",
    false: "",
  });
  const isExpired = loyaltyPointSource.isExpired === true;
  const [expired] = useState({
    true: "Expired",
    false: "",
  });

  _logger(loyaltyPoint);

  return (
    <React.Fragment>
      <tr>
        <td>
          <Flex alignItems="center" className="position-relative">
            <div className="ms-3">
              <h5 className="mb-0 fw-semi-bold">{loyaltyPointSource.name}</h5>
            </div>
          </Flex>
        </td>
        <td>
          <h5>{loyaltyPointSource.pointsAwarded}</h5>
        </td>
        <td>
          <p>{loyaltyPointDate}</p>
        </td>
        <td>
          <p>{dateExpire}</p>
        </td>
        <td>
          <span>
            {isExpired ? expired.true : expired.false}{" "}
            {redeemedPoint ? redeemed.true : redeemed.false}
          </span>
        </td>
      </tr>
    </React.Fragment>
  );
};

export default LoyaltyPointsTotal;
LoyaltyPointsTotal.propTypes = {
  loyaltyPoint: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string.isRequired,
    }),
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
    dateCreated: PropTypes.string.isRequired,
  }),
};
