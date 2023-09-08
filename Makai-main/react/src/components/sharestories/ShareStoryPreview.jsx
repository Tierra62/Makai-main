import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import createMarkup from "helpers/createMarkup";
import debug from "sabio-debug";
import "./sharestories.css";
import dompurify from "dompurify";
import userService from "services/userService";
import { Col, Row } from "react-bootstrap";

const _logger = debug.extend("story");

function SharedStoryPreview(props) {
  _logger("props", props);
  const sharedStory = props.data;
  const userInfo = props.currentUser;
  _logger("userInfo", userInfo);

  const [user, setAvatar] = useState({
    avatarUrl: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    userService.getById(userInfo.id).then(userSuccess).catch(userError);
  }, []);

  const userSuccess = (response) => {
    _logger("getInfo", response);
    setAvatar((prevState) => {
      const newUrl = { ...prevState };
      newUrl.avatarUrl = response.item.avatarUrl;
      newUrl.firstName = response.item.firstName;
      newUrl.lastName = response.item.lastName;
      _logger("newAvatar", newUrl);
      return newUrl;
    });
  };

  const userError = (error) => {
    _logger(error);
    AlertError();
  };

  createMarkup = () => {
    dompurify.sanitize(sharedStory.story);
    return { __html: sharedStory.story };
  };

  return (
    <React.Fragment>
      <div className="card mb-3">
        <Row className="g-0">
          <Col md="4" className="my-auto mx-auto">
            <img className="card-img" src={sharedStory.image} alt="" />
          </Col>
          <Col md="6" className="mx-auto my-auto">
            <div className="card-body">
              <h1 className="story-h1 card-title pb-4">
                Title:{sharedStory.name}
              </h1>
              <h4>
                Author: {user.firstName + " " + user.lastName + " "}
                <img
                  className="story-avatar-thumbnail"
                  src={user.avatarUrl}
                  alt=""
                />
              </h4>
              <h4 className="card-text">
                Story:
                <div
                  dangerouslySetInnerHTML={createMarkup()}
                  className="editor"
                ></div>
              </h4>
              <p className="fw-bold h4 card-text">Email: {sharedStory.email}</p>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
}

SharedStoryPreview.propTypes = {
  data: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    story: PropTypes.string,
    email: PropTypes.string,
  }),
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default React.memo(SharedStoryPreview);
