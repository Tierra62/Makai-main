import React from "react";
import "./newsletterstyle.css";
import PropTypes from "prop-types";
import { Card, Button } from "react-bootstrap";
import Flex from "../common/Flex";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import * as newsletterContentService from "../../services/newsletterContentService.js";
import debug from "sabio-debug";

const NewsletterCard = (props) => {
  const navigate = useNavigate();
  const _logger = debug.extend("NewsletterForm");

  const newsletter = props.newsletter;
  _logger("Here is the newsletter, we need to find the content id", newsletter);

  const onDeleteClicked = (e) => {
    e.preventDefault();
    props.onDeleteNewsletterClicked(newsletter);
  };

  const onUpdateClicked = (e) => {
    e.preventDefault();
    newsletterContentService
      .selectByNewsletterId(newsletter.id)
      .then(successGetContent)
      .catch(failureGetContent);
  };

  const successGetContent = (response) => {
    _logger("here's the content", response);
    const newContentList = response.item.map((arrayItem) => {
      const newArrayItem = {};
      newArrayItem.value = arrayItem.value;
      newArrayItem.id = arrayItem.newsletterContentId;
      newArrayItem.templateKeyId = arrayItem.templateKeyId;
      newArrayItem.name = arrayItem.keyName;
      newArrayItem.keyType = arrayItem.keyType;
      return newArrayItem;
    });
    const newsletterForTransport = { ...newsletter };
    newsletterForTransport.contentList = newContentList;

    const information = {
      type: "NEWSLETTER_VIEW",
      payload: newsletterForTransport,
    };
    navigate(`/newsletter/${newsletter.id}/edit`, { state: information });
  };
  const failureGetContent = (response) => {
    _logger("failed", response);
  };

  return (
    <React.Fragment>
      <Card className=" m-2 p-1 newsletter-card">
        <Card.Img
          className="newsletter-image"
          variant="top"
          src={newsletter.coverPhoto}
          alt="NewsletterImage"
        />
        <Card.Body
          as={Flex}
          direction="column"
          justifyContent="between"
          className="d-flex flex-column justify-content-center"
        >
          <Card.Title as="h5" className="text-center">
            {newsletter.name}
          </Card.Title>
          <Card.Text className="text-center">
            Newsletter Template : {newsletter?.newslettersTemplateName}
          </Card.Text>
          <p className="text-muted text-center">
            {newsletter.dateToPublish !== "0001-01-01T00:00:00" && (
              <small className="text-muted text-center">
                Publish Date:
                {new Date(newsletter?.dateToPublish).toLocaleDateString()}
              </small>
            )}
            {newsletter?.dateToPublish === "0001-01-01T00:00:00" && (
              <small className="text-muted text-center">
                Publish Date: N/A
              </small>
            )}
          </p>
          <p className="text-muted text-center">
            {newsletter.dateToExpire !== "0001-01-01T00:00:00" && (
              <small className="text-muted text-center">
                Expiration Date:
                {new Date(newsletter?.dateToExpire).toLocaleDateString()}
              </small>
            )}
            {newsletter?.dateToExpire === "0001-01-01T00:00:00" && (
              <small className="text-muted text-center">
                Expiration Date: N/A
              </small>
            )}
          </p>
          <div className="d-flex justify-content-center">
            <Button type="submit" onClick={onUpdateClicked}>
              <small>{"Update   "} </small>
              <GrUpdate />
            </Button>
            <Button type="submit" variant="danger" onClick={onDeleteClicked}>
              <FaTrashAlt type="button" />
            </Button>
          </div>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

NewsletterCard.propTypes = {
  onDeleteNewsletterClicked: PropTypes.func.isRequired,

  newsletter: PropTypes.shape({
    id: PropTypes.number.isRequired,
    newslettersTemplateName: PropTypes.string.isRequired,
    newslettersTemplatePrimaryImage: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    coverPhoto: PropTypes.string,
    dateToPublish: PropTypes.string,
    dateToExpire: PropTypes.string,
    dateCreated: PropTypes.string.isRequired,
    dateModified: PropTypes.string.isRequired,

    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      mi: PropTypes.string,
      avatarUrl: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default React.memo(NewsletterCard);
