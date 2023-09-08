import React, { useEffect, useState, useCallback } from "react";
import coverSrc from "assets/img/illustrations/beach.jpg";
import { Col, Row } from "react-bootstrap";
// import ProfileBanner from "./ProfileBanner";
import ProfileBanner from "./ProfileBanner";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import userService from "services/userService";
import "./profile.css";
import ProfileNavbar from "./ProfileNavbar";
import OrderHistoryCard from "./cards/OrderHistoryCard";
import NotificationCard from "./cards/NotficationCard";
import EditProfileCard from "./cards/EditProfileCard";
import PaymentHistoryCard from "./cards/PaymentHistoryCard";
import SecurityCard from "./cards/SecurityCard";
import Swal from "sweetalert2";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";

const _logger = debug.extend("profile");

const defaultUser = {
  avatarUrl: "",
  firstName: "",
  lastName: "",
  email: "",
  mi: "",
  phone: "",
  id: 0,
  dob: "",
  is2FA: false,
};
const ProfilePage = ({ currentUser }) => {
  const [user, setUser] = useState(defaultUser);

  const navigate = useNavigate();

  useEffect(() => {
    userService
      .onGetUserId(currentUser.id)
      .then(onGetCurrentSuccess)
      .catch(onGetCurrentError);
  }, []);

  const onGetCurrentSuccess = (response) => {
    _logger("Response", response);
    setUser((prevState) => {
      const currentUsers = { ...prevState };
      currentUsers.id = response.item.id;
      currentUsers.firstName = response.item.firstName;
      currentUsers.lastName = response.item.lastName;
      currentUsers.email = response.item.email;
      currentUsers.phone = response.item.phone;
      currentUsers.dob = response.item.dob;
      currentUsers.mi = response.item.mi;
      currentUsers.avatarUrl = response.item.avatarUrl;
      currentUsers.is2FA = response.item.is2FA;
      return currentUsers;
    });
  };

  const onGetCurrentError = () => {
    toastr.error("Current User Infomation Not Found");
  };

  const [cardComponent, setCardComponent] = useState("edit");

  const onLogoutAlertShown = ({ isConfirmed }) => {
    if (isConfirmed) {
      userService
        .logoutUser()
        .then(onLogoutUserSuccess)
        .catch(onLogoutUserError);
    } else {
      toastr.warning("Logout Cancelled");
    }
  };

  const onLogoutUserSuccess = () => {
    toastr.success("Successfully Logged Out");
    navigate("/login");
  };

  const onLogoutUserError = () => {
    toastr.error("Error Logging Out. Please try again.");
  };

  const handleSelection = (nameSelected) => {
    if (nameSelected === "logout") {
      _logger("logout");
      Swal.fire({
        title: "Are you sure you want to logout?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Logout",
        confirmButtonColor: "red",
        dangerMode: true,
      }).then(onLogoutAlertShown);
    } else {
      setCardComponent(nameSelected);
    }
  };

  const onProfileChange = (newProfileInfo) => {
    setUser((prevState) => {
      let pd = { ...prevState };
      pd.firstName = newProfileInfo.firstName;
      pd.lastName = newProfileInfo.lastName;
      pd.mi = newProfileInfo.mi;
      pd.phone = newProfileInfo.phone;
      pd.dob = newProfileInfo.dob;
      pd.avatarUrl = newProfileInfo.avatarUrl;
      return pd;
    });
  };

  const onEmailChange = (newEmail) => {
    setUser((prevState) => {
      let pd = { ...prevState };
      pd.email = newEmail;
      return pd;
    });
  };

  const handle2FAChange = useCallback((value) => {
    _logger("Switching 2FA", value);
    const twoFAHandler = on2FASuccess(value);
    userService.update2FA(value).then(twoFAHandler).catch(on2FAError);
  }, []);

  const on2FASuccess = (value) => {
    _logger("2FA success value: ", value);
    if (value) {
      swal("Success", "2FA Successfully Enabled", "success");
    } else {
      swal("Success", "2FA Successfully Disabled", "success");
    }
    setUser((prevState) => {
      const pd = { ...prevState };
      pd.is2FA = value;
      return pd;
    });
  };

  const on2FAError = (error) => {
    _logger("2FA error: ", error);
    swal("Error", "Failed to switch 2FA, please try again.", "error");
  };

  const renderProfileCard = (nameSelected) => {
    let card = null;
    if (user.id > 0) {
      switch (nameSelected) {
        case "orders":
          card = <OrderHistoryCard />;
          break;
        case "payments":
          card = <PaymentHistoryCard />;
          break;
        case "security":
          card = (
            <SecurityCard
              user={user}
              handleEmailChange={onEmailChange}
              handle2FAChange={handle2FAChange}
            />
          );
          break;
        case "notifications":
          card = <NotificationCard />;
          break;
        case "edit":
          card = (
            <EditProfileCard
              user={user}
              handleProfileChange={onProfileChange}
            />
          );
          break;
      }
    }
    return card;
  };

  return (
    <>
      <ProfileBanner>
        <ProfileBanner.Header coverSrc={coverSrc} className="mb-0" />
        <ProfileBanner.Body user={user}></ProfileBanner.Body>
      </ProfileBanner>
      <Row className="g-3">
        <Col xxl={2} lg={3} md={4} sm={12}>
          <ProfileNavbar
            handleSelection={handleSelection}
            activeSelection={cardComponent}
          />
        </Col>
        <Col xxl={10} lg={9} md={8} sm={12}>
          {renderProfileCard(cardComponent)}
        </Col>
      </Row>
    </>
  );
};

ProfilePage.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

export default ProfilePage;
