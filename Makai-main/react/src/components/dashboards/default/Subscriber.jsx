import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import sabioDebug from "sabio-debug";
const _logger = sabioDebug.extend("NewsletterSubCard");

function Subscriber(props) {
  const [isSubscribed, setIsSubscribed] = useState(true);

  useEffect(() => {
    if (props.subscriber.isSubscribed) {
      return setIsSubscribed(true);
    } else {
      return setIsSubscribed(false);
    }
  }, [changeSubscription]);

  const subscriptionDate = (subDate) => {
    subDate = props.subscriber.dateCreated;
    return subDate.split("T").splice(0, 1);
  };

  const changeSubscription = () => {
    setIsSubscribed((prev) => !prev);
    _logger("changeSubscription", props.subscriber);
    props.onSubscriberClicked(props.subscriber, props.subscriber.email);
  };

  return (
    <tr>
      <td>{props.subscriber.email}</td>
      <td>{subscriptionDate(props.subscriber.dateCreated)}</td>
      <td> {!isSubscribed ? "Not subscribed" : "Subscribed"}</td>
      <td className="text-end">
        <button
          className="btn btn-outline-secondary me-1 mb-1"
          type="button"
          onClick={changeSubscription}
        >
          {isSubscribed ? "Unsubscribe" : "Subscribe"}
        </button>
      </td>
    </tr>
  );
}

Subscriber.propTypes = {
  subscriber: PropTypes.shape({
    email: PropTypes.string.isRequired,
    dateCreated: PropTypes.string.isRequired,
    isSubscribed: PropTypes.bool.isRequired,
  }).isRequired,
  onSubscriberClicked: PropTypes.func.isRequired,
};

export default React.memo(Subscriber);
