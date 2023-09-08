import React from "react";
import debug from "sabio-debug";
import { Card, Button, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import "./lessons.css";
import { useNavigate } from "react-router-dom";

const _logger = debug.extend("training");

function LessonCard(props) {
  _logger("props", props);
  const aLesson = props.lesson;

  const navigate = useNavigate();

  function onUpdateClicked(e) {
    e.preventDefault();
    const stateForTransport = { type: "LESSON_EDIT", payload: aLesson };
    navigate("/training/lessons/" + aLesson.id + "/form", {
      state: stateForTransport,
    });
  }

  function onLocalDeleteClicked(e) {
    e.preventDefault();
    props.onDeleteClicked(props.lesson, e);
    _logger("on delete was clicked");
  }

  const checkAdminRole = (arrayOfRoles) => {
    for (let i = 0; i < arrayOfRoles.length; i++)
      if (arrayOfRoles[i] === "Admin") {
        return true;
      } else {
        return false;
      }
  };

  return (
    <React.Fragment>
      <Col>
        <Card className="lesson-card p-1 m-2 w-100">
          <Card.Img className="lesson-image" src={aLesson.coverImageUrl} />
          <Card.Body className="d-flex flex-column justify-content-center">
            <Card.Title as="h5" className="text-center">
              {aLesson.title}
            </Card.Title>
            <Card.Text className="text-black text-center">
              {aLesson.summary}
            </Card.Text>
            <Button
              href={aLesson.mediaUrl}
              target="_blank"
              type="submit"
              color="primary"
              size="sm"
            >
              View Content
            </Button>
            <br></br>
            {checkAdminRole(props.userRoles) && (
              <div className="d-grid gap-2">
                <Button
                  type="submit"
                  color="primary"
                  size="sm"
                  onClick={onUpdateClicked}
                >
                  Update
                </Button>

                <Button
                  variant="danger"
                  type="submit"
                  color="primary"
                  size="sm"
                  onClick={onLocalDeleteClicked}
                >
                  Delete
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </React.Fragment>
  );
}

LessonCard.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    coverImageUrl: PropTypes.string.isRequired,
    mediaUrl: PropTypes.string.isRequired,
  }).isRequired,
  userRoles: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onDeleteClicked: PropTypes.func.isRequired,
};

export default React.memo(LessonCard);
