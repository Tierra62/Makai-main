import React from "react";
import { Accordion, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
function FaqAccordionItem(props) {
  const aFaq = props.faq;

  const navigate = useNavigate();

  const onEditHandler = () => {
    const stateForTransports = { type: "Faq_View", payload: aFaq };
    navigate(`/addfaq/`, { state: { stateForTransports } });
  };

  return (
    <React.Fragment>
      <Card>
        <Card.Body>
          <div id="general" className="container">
            <Accordion className="general" defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header className="faqs-info">
                  <div className="row w-100">
                    <div className="col-10 fw-bold">{aFaq?.question}</div>
                    {props.user.roles.find((role) => role === "Admin") && (
                      <div className="col-2">
                        <div
                          type="button"
                          className="btn btn-primary"
                          onClick={onEditHandler}
                        >
                          Edit
                        </div>
                      </div>
                    )}
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <p>{aFaq?.answer}</p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
}

FaqAccordionItem.propTypes = {
  faq: PropTypes.shape({
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default FaqAccordionItem;
