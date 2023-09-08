import React, { useState, useEffect } from "react";
import debug from "sabio-debug";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import * as podcastService from "services/podcastService";
import "./podcast.css";
import PodcastRow from "./PodcastRow";
import { useNavigate } from "react-router-dom";

const _logger = debug.extend("Podcasts");

function Podcasts() {
  const [podcastData, setPodcastData] = useState({
    podcastArray: [],
    podcastComponents: [],
  });

  const [currentTrack, setCurrentTrack] = useState({
    title: "",
    link: "",
    coverPhoto: "",
    description: "",
    date: "",
  });

  const handlePodcastClickd = (podcast) => {
    _logger("podcast --->", podcast);
    _logger("currentTrack", currentTrack);

    setCurrentTrack({
      title: podcast.title,
      link: podcast.link,
      coverPhoto: podcast.coverPhoto,
      description: podcast.description,
      date: podcast.date,
    });
  };

  _logger("podcast", podcastData, setPodcastData);

  useEffect(() => {
    podcastService
      .getPodcast()
      .then(onGetPodcastSuccess)
      .catch(onGetPodcastError);
  }, []);

  const onGetPodcastSuccess = (response) => {
    _logger("onGetPodcastSuccessHandler", response);

    let arrayOfPods = response.data.items;
    let firstTrack = response.data.items[0];
    _logger({ arrayOfPods });
    _logger({ firstTrack });

    setPodcastData((prevState) => {
      const podData = { ...prevState };
      podData.podcastArray = arrayOfPods;
      podData.podcastComponents = arrayOfPods.map(mapPodcasts);
      return podData;
    });

    setCurrentTrack({
      title: firstTrack.title,
      link: firstTrack.link,
      coverPhoto: firstTrack.coverPhoto,
      description: firstTrack.description,
    });
  };

  const mapPodcasts = (podcast, index) => {
    return (
      <PodcastRow
        key={`${podcast.id}_${index}`}
        podcast={podcast}
        onPodcastChange={handlePodcastClickd}
        onParentDeleteClick={onClickDelete}
      />
    );
  };

  const onGetPodcastError = (response) => {
    _logger("error", response);
  };

  const navigate = useNavigate();
  const goToPage = (e) => {
    _logger(e.currentTarget.dataset.page);
    navigate(e.currentTarget.dataset.page);
  };

  const onClickDelete = (myPodcast) => {
    _logger("myPodCase", myPodcast);
    const handler = getDeleteSuccesshandler(myPodcast.id);
    podcastService
      .deletePodcast(myPodcast.id)
      .then(handler)
      .catch(onDeleteError);
  };

  const getDeleteSuccesshandler = (id) => {
    return () => {
      setPodcastData((prevState) => {
        const mappedPodcasts = { ...prevState };
        mappedPodcasts.podcastArray = [...mappedPodcasts.podcastArray];
        const idxOf = mappedPodcasts.podcastArray.findIndex((pod) => {
          let result = false;
          if (pod.id === id) {
            result = true;
          }
          return result;
        });
        if (idxOf >= 0) {
          mappedPodcasts.podcastArray.splice(idxOf, 1);
          mappedPodcasts.podcastComponents =
            mappedPodcasts.podcastArray.map(mapPodcasts);
        }
        return mappedPodcasts;
      });
    };
  };

  const onDeleteError = (deleteError) => {
    _logger("deleting", deleteError);
  };

  return (
    <React.Fragment>
      <div className="container contact-container-top mt-10 mx-auto mp-5">
        <div className="card text-center mb-1 w-100 ">
          <tr className="align-self-center w-100 ">
            <img
              src={currentTrack.coverPhoto}
              className="mx-auto image-pod w-5 h-5 mt-3 mb-3"
            />
            <h1 className="fs-100">{currentTrack.title}</h1>
            <h5 className="">{currentTrack.description}</h5>
            <AudioPlayer
              controls
              src={currentTrack.link}
              showJumpControls={true}
              onPodcastChange={handlePodcastClickd}
            />
          </tr>
        </div>
        <div className="table-podcast podcast-scrollbar pcastScr">
          <table className="table table-hover w-100">
            <tbody className="table">
              {podcastData?.podcastComponents && podcastData.podcastComponents}
            </tbody>
          </table>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary mx-auto"
            id="Podcast Form"
            data-page="/podcasts/new"
            onClick={goToPage}
          >
            Add Podcasts
          </button>
        </div>
      </div>
      <h5 className="podcast-footer text-center fw-bold fs-5 mt-6 mb-6">
        Find us in your favorite Podcast App
      </h5>
    </React.Fragment>
  );
}

export default Podcasts;
