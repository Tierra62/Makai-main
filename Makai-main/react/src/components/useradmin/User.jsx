import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../assets/scss/user.scss";
import Swal from "sweetalert2";

function User(props) {
  const [isActivated, setIsActivated] = useState(
    props.user.statusType.name === "Active"
  );

  const Alert = () => {
    Swal.fire(
      "Status Change Successful!",
      "Click button again to revert back.",
      "success"
    );
  };

  const onToggleStatus = () => {
    const newStatusId = isActivated ? 2 : 1;
    props.onParentToggleStatus(props.user, newStatusId);
    setIsActivated(!isActivated);
  };

  return (
    <div className="card user-admin-card1 overflow-hidden my-3 mx-3">
      <div className="card-img-top user-admin-card-img-top1 text-center">
        <div className="pt-5">
          <img
            className="img-fluid rounded-circle user-admin-rounded-circle mx-auto"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5kBkU7uhDrX_jgDz3JJXKCMrEOd_def3Qj5FYMKSKmR5wUUc-sBUQcRI9Y1gGTYy1kdc&usqp=CAU"
            alt="Card image cap"
          />
        </div>
      </div>
      <div className="card-body card-body1">
        <div className="card-title user-admin-card-title1 text-center">
          <h4>
            {props.user.firstName} {props.user.lastName}
          </h4>
        </div>
        <div className="card-text text-center fs-1 font-weight-bold text-dark">
          {props.user.roles && props.user.roles.length > 0 && (
            <div>{props.user.roles[0].name}</div>
          )}
          <div>{props.user.statusType.name}</div>
        </div>
        <div className="button user-admin-button1" onClick={Alert}>
          <button
            className={isActivated ? "user-admin-Deactivate" : "Activate"}
            onClick={onToggleStatus}
          >
            {isActivated ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}

User.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    dob: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    statusType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }),
  onUserClicked: PropTypes.func,
  onParentToggleStatus: PropTypes.func,
};
export default User;
