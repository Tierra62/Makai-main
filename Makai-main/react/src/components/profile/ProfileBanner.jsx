import Background from "components/common/Background";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import classNames from "classnames";
import Avatar from "components/common/Avatar";
import PropTypes from "prop-types";
import FalconCardHeader from "components/common/FalconCardHeader";
import { FiMail, FiPhone } from "react-icons/fi";
import "./profile.css";

const ProfileBannerHeader = ({ coverSrc, className }) => {
  return (
    <Card.Header className={classNames(className, "position-relative h-5")}>
      <Background image={coverSrc} className="rounded-3 rounded-bottom-0" />
    </Card.Header>
  );
};

const genericProfilePhoto =
  "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg";

const ProfileBannerBody = ({ children, user }) => {
  const [bannerData, setBannerData] = useState({
    avatar: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    setBannerData({
      avatar: user.avatarUrl || genericProfilePhoto,
      firstName: user.firstName,
      lastName: user.lastName,
      mi: user.mi,
      phone: user.phone,
      email: user.email,
    });
  }, [user]);

  const renderFullName = () => {
    let nameStr = bannerData.firstName;
    if (bannerData.mi) {
      nameStr = `${nameStr} ${bannerData.mi}`;
    }
    nameStr = `${nameStr} ${bannerData.lastName}`;
    return nameStr;
  };

  const renderPhoneNumber = () => {
    let numberStr = "";
    const phone = bannerData.phone;
    if (phone.length !== 10) {
      numberStr = phone;
    } else {
      const areaCode = phone.slice(0, 3);
      const basicFirst = phone.slice(3, 6);
      const basicLast = phone.slice(6, 10);
      numberStr = `+1 (${areaCode}) ${basicFirst}-${basicLast} `;
    }

    return numberStr;
  };

  return (
    <Card.Body className="pt-0">
      <div className="profile-image-container">
        <Avatar
          size="5xl"
          className="avatar-profile"
          src={bannerData.avatar}
          mediaClass="img-thumbnail shadow-sm"
        />
      </div>
      <div className="ms-sm-10 ms-9">
        <FalconCardHeader title={renderFullName()} />
        <div className="row">
          <div className="hidden-under-sm fit-content-md">
            <FiMail className="text-info" /> <strong>{bannerData.email}</strong>
          </div>
          <div className="px-2 hidden-under-lg fit-content-md">|</div>
          <div className="hidden-under-sm fit-content-md">
            <FiPhone className="text-success" />{" "}
            <strong>{renderPhoneNumber()}</strong>
          </div>
        </div>
        {children}
      </div>
    </Card.Body>
  );
};

const ProfileBanner = ({ children }) => {
  return <Card className="mb-3">{children}</Card>;
};

ProfileBanner.Header = ProfileBannerHeader;
ProfileBanner.Body = ProfileBannerBody;

ProfileBanner.propTypes = {
  children: PropTypes.node.isRequired,
};

ProfileBannerHeader.propTypes = {
  coverSrc: PropTypes.string.isRequired,
  className: PropTypes.string,
};

ProfileBannerBody.propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    mi: PropTypes.string,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node,
};

export default ProfileBanner;
