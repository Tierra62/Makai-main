import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import debug from "sabio-debug";
import "./sharestories.css";
import createMarkup from "helpers/createMarkup";
import dompurify from "dompurify";
import { Col, Row } from "react-bootstrap";

const _logger = debug.extend("share story card");

function ShareStoryCard(props) {
  _logger("a", props);

  const { name, story, createdBy, files, dateCreated } = props.aStory;

  const navigate = useNavigate();

  const onStoryViewMore = () => {
    _logger(props);
    navigate(`/social/sharestories/${props.aStory.id}`, {
      state: props.aStory,
    });
  };

  createMarkup = () => {
    dompurify.sanitize(story);
    return { __html: story?.substring(0, 125) + "..." };
  };

  const formattedDate = new Date(dateCreated).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <React.Fragment>
      <hr className="my-2" />
      <Row className="story-card">
        <Col xs="2" sm="3" md="3" lg="3" className="my-auto">
          <a className="story-info">
            <img
              className="story-img-thumbnail"
              src={files[0].url}
              alt=""
              onClick={onStoryViewMore}
            />
          </a>
        </Col>
        <Col className="my-auto" xs="10" sm="9" md="8" lg="6">
          <h2>
            <span className="text-light">
              <a className="story-name" onClick={onStoryViewMore}>
                {name}
              </a>
              <br></br>
              <h5 className="text-light">
                Author: {createdBy.firstName + " " + createdBy.lastName + "  "}
                <img
                  className="story-avatar-thumbnail"
                  src={createdBy.avatarUrl}
                  alt=""
                />
              </h5>
            </span>
          </h2>
          <article className="text-light">
            <div
              className="editor"
              dangerouslySetInnerHTML={createMarkup()}
            ></div>
          </article>
          <br></br>
          <a className="story-info btn-sm" onClick={onStoryViewMore}>
            View Full Story
          </a>
          <h5 className="story-date">Date Created: {formattedDate}</h5>
        </Col>
      </Row>
      <hr className="my-2" />
    </React.Fragment>
  );
}

ShareStoryCard.propTypes = {
  aStory: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    story: PropTypes.string.isRequired,
    createdBy: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      id: PropTypes.number.isRequired,
      avatarUrl: PropTypes.string.isRequired,
    }),
    dateCreated: PropTypes.string,
    files: PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ShareStoryCard;
