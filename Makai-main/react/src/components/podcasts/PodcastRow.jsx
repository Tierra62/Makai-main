import React from "react";
import "react-h5-audio-player/lib/styles.css";
import PropTypes from "prop-types";
import "./podcast.css";
import debug from "sabio-debug";
import { useNavigate } from "react-router-dom";
import * as dateFormater from "../../utils/dateFormater";

const _logger = debug.extend("Podcasts");

function PodcastRow(props) {
  const navigate = useNavigate();
  const myPodcast = props.podcast;

  const onLocalClicked = (e) => {
    e.preventDefault();
    props.onPodcastChange(myPodcast);
  };

  const onEditClick = (e) => {
    e.preventDefault();
    navigateToEditPodcasts(myPodcast);
  };
  const navigateToEditPodcasts = (e) => {
    _logger(e);
    const PodcastState = {
      state: { type: "Podcast_Edit", payload: myPodcast },
    };
    navigate(`/podcasts/${myPodcast.id}`, PodcastState);
  };

  const onLocalDeleteClick = (e) => {
    e.preventDefault();
    props.onParentDeleteClick(myPodcast);
  };

  return (
    <tr className="align-self-center w-50" type="row" onClick={onLocalClicked}>
      <td className="text-nowrap">
        <img src={myPodcast.coverPhoto} className="image-pod w-25 h-25" />
      </td>
      <td className="text-nowrap">{myPodcast.title}</td>
      <td className="text-nowrap">{myPodcast.description}</td>
      <td>
        <span className="badge badge rounded-pill d-block p-2 badge-soft-success">
          {`${dateFormater.formatDateTime(myPodcast.date).slice(0, 11)}`}
          <span
            className="ms-1 fas fa-check"
            data-fa-transform="shrink-2"
          ></span>
        </span>
        <td>
          <button
            onClick={onEditClick}
            className="btn btn-primary border"
            data-page={myPodcast.id}
          >
            Edit
          </button>
          <button
            onClick={onLocalDeleteClick}
            type="button"
            className="btn btn-danger border "
          >
            Delete
          </button>
        </td>
      </td>
    </tr>
  );
}

PodcastRow.propTypes = {
  podcast: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    coverPhoto: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    currentTrack: PropTypes.string,
    length: PropTypes.number,
    id: PropTypes.number.isRequired,
  }),
  onPodcastChange: PropTypes.func,
  onParentDeleteClick: PropTypes.func,
};
export default PodcastRow;
