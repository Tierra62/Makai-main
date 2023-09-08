import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import createMarkup from "helpers/createMarkup";
import { Col, Container, Row, Button } from "react-bootstrap";
import "./sharestories.css";
import dompurify from "dompurify";
import debug from "sabio-debug";

function ShareStoryDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [storyState] = useState(state);
  const _logger = debug.extend("share story");

  const goBack = () => {
    navigate("/social/sharestories");
  };

  createMarkup = () => {
    dompurify.sanitize(storyState.story);
    return { __html: storyState.story };
  };

  const scrollToTop = () => {
    return window.scrollTo(0, 0);
  };
  _logger(scrollToTop());

  const formattedDate = new Date(storyState.dateCreated).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <React.Fragment>
      <div className="story-background story-detail-background">
        <Container className="py-3">
          <div className="card mb-3 mt-5">
            <Row className="g-0">
              <Col md="4" className="my-auto mx-auto">
                <img
                  className="card-img w-100"
                  src={storyState.files[0].url}
                  alt=""
                />
              </Col>
              <Col md="6" className="mx-auto my-auto">
                <div className="card-body">
                  <h1 className="story-h1 fw-bold card-title pb-4">
                    {storyState.name}
                  </h1>
                  <h5 className="card-text">
                    <div
                      dangerouslySetInnerHTML={createMarkup()}
                      className="editor"
                    ></div>
                  </h5>
                  <p className="fw-bold h4 card-text">
                    Author:
                    {" " +
                      storyState.createdBy.firstName +
                      " " +
                      storyState.createdBy.lastName +
                      " "}
                    <img
                      className="story-avatar-thumbnail"
                      src={storyState.createdBy.avatarUrl}
                      alt=""
                    />
                  </p>
                  <p className="fw-bold h4 card-text">
                    Email: {storyState.email}
                  </p>
                  <h5 className="story-date-detail">
                    Date Created: {formattedDate}
                  </h5>
                  <Button onClick={goBack}>Go Back to Stories</Button>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default ShareStoryDetail;
