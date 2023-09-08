import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import debug from "sabio-debug";

function CurrentSurvey({ survey }) {
  const _logger = debug.extend("survey");
  const [currentSurvey, setSurvey] = useState({
    questions: [],
    questionComponents: [],
  });
  _logger("surveyprop", survey);

  useEffect(() => {
    setSurvey((prevState) => {
      const update = { ...prevState };
      update.questions = survey.questions;
      update.questionComponents = update.questions.map(questionMapper);
      return update;
    });
  }, [survey]);

  const questionMapper = (question) => {
    const answers = question.answerOptions?.map(answermapper);
    return (
      <div key={question.id}>
        <p className="fs-1">{question.question}</p>
        <p className="fst-italic ">{answers}</p>
      </div>
    );
  };
  const answermapper = (answers) => {
    return (
      <div key={answers.id}>
        <p>{answers.text}</p>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">{survey.name}</h2>
          {currentSurvey.questionComponents[0] &&
            currentSurvey.questionComponents}
        </div>
      </div>
    </React.Fragment>
  );
}
CurrentSurvey.propTypes = {
  survey: PropTypes.shape({
    name: PropTypes.string.isRequired,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        question: PropTypes.string.isRequired,
        answerOptions: PropTypes.arrayOf(
          PropTypes.shape({
            text: PropTypes.string.isRequired,
          }).isRequired
        ),
      }).isRequired
    ),
  }).isRequired,
};

export default CurrentSurvey;
