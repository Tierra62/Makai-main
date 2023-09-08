import React, { useEffect, useState } from "react";
import ShareStoryCard from "./ShareStoryCard";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import { Col, Container, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getStories } from "services/sharedStoriesService";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import "./sharestories.css";

const _logger = debug.extend("share story");

function ShareStories(props) {
  const [storyData, setStoryData] = useState({
    pageIndex: 0,
    pageSize: 6,
    totalCount: 0,
    pagedItems: [],
    shareStoryComponent: [],
  });

  useEffect(() => {
    getStories(storyData.pageIndex, storyData.pageSize)
      .then(onSuccess)
      .catch(onError);
  }, [storyData.pageIndex]);

  const onSuccess = (response) => {
    setStoryData((prevState) => {
      const pd = { ...prevState };
      pd.shareStoryComponent = response.item?.pagedItems
        ?.sort(
          (a, b) =>
            new Date(b.story.dateCreated) - new Date(a.story.dateCreated)
        )
        .map(mapStories);
      pd.totalCount = response.item?.totalCount;
      return pd;
    });
  };

  const onError = (error) => {
    _logger(error);
    Toastify({
      text: "Unable to fulfill request!",
      className: "error",
      style: {
        background: "linear-gradient(to right, crimson)",
      },
    }).showToast();
  };

  const mapStories = (aStory) => {
    return <ShareStoryCard key={`${aStory.story.id}`} aStory={aStory} />;
  };

  const onPageChange = (page) => {
    setStoryData((prevState) => {
      const pd = { ...prevState };
      pd.current = page;
      pd.pageIndex = page - 1;
      return pd;
    });
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo(0, 500);
  };

  return (
    <React.Fragment>
      <Container>
        <div className="story-main-background">
          <Row className="justify-content-center mt-8 mb-6">
            <Col md="6">
              <div className="text-center">
                <h1 className="story-h1 fw-bold text-white">
                  Noteworthy Renter{" "}
                  <article className="story-makai-title2">Stories</article>
                </h1>
              </div>
            </Col>
          </Row>

          <Row className="mb-6 justify-content-center">
            <Col md="8">
              <h2 className="story-text-center text-center">
                See how other renters like yourself have acheived extraordinary
                services from{" "}
                <span className="story-makai-title">Makai Rentals</span>
              </h2>
            </Col>
          </Row>

          <Row>
            <Col md="12 text-center">
              {props.currentUser.isLoggedIn ? (
                <Button
                  as={Link}
                  variant="outline-light"
                  className="my-2 px-4 mb-4 fw-bold share-story-btn"
                  to="/sharestories/new"
                >
                  Share Your Story
                </Button>
              ) : (
                ""
              )}
            </Col>
          </Row>
        </div>

        <Container>{storyData.shareStoryComponent}</Container>

        <Row className="justify-content-center text-center">
          <Pagination
            onChange={onPageChange}
            current={storyData.pageIndex + 1}
            locale={locale}
            total={storyData.totalCount}
            pageSize={storyData.pageSize}
          />
        </Row>
      </Container>
    </React.Fragment>
  );
}

ShareStories.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.int,
    roles: PropTypes.string,
    isLoggedIn: PropTypes.bool,
  }),
};
export default ShareStories;
