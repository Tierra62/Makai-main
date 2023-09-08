import React, { useEffect, useState, useCallback } from "react";
import * as newsletterService from "../../services/newsletterService";
import NewsletterCard from "./NewsletterCard";
import debug from "sabio-debug";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { Row, Col } from "react-bootstrap";
import swal from "sweetalert";
import Toastify from "toastify-js";

const _logger = debug.extend("NewsletterView");

const NewsletterView = () => {
  const [newsletterData, setNewsletterData] = useState({
    newsletterArray: [],
    newsletterComponents: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
  });

  useEffect(() => {
    newsletterService
      .getAll(newsletterData.page - 1, newsletterData.pageSize)
      .then(onGetNewsletterSuccess)
      .catch(onGetNewsletterError);
  }, []);

  const onGetNewsletterSuccess = (data) => {
    _logger(data);
    let newNewsletterArr = data.item.pagedItems;
    const totalCount = data.item.totalCount;

    setNewsletterData((prevState) => {
      const newsletterData = { ...prevState };
      newsletterData.newsletterArray = newNewsletterArr;
      newsletterData.newsletterComponents = newNewsletterArr.map(mapNewsletter);
      newsletterData.totalCount = totalCount;
      return newsletterData;
    });
  };

  const onGetNewsletterError = (error) => {
    _logger(error, "Newsletter error");
  };

  const onDeleteRequested = useCallback((myNewsletter) => {
    const handler = getDeleteSuccessHandler(myNewsletter.id);

    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this newsletter",
      icon: "warning",
      buttons: ["No, cancel it!", "Yes, I am sure!"],
      dangerMode: true,
    }).then(function (isConfirm) {
      if (isConfirm) {
        newsletterService
          .deleteById(myNewsletter.id)
          .then(handler)
          .catch(errorDelete);
      } else {
        Toastify({
          text: "Delete Cancelled",
          className: "Error",
        }).showToast();
      }
    }, []);
  });

  const errorDelete = () => {
    Toastify({
      text: "Delete Failed",
      className: "Error",
    }).showToast();
  };

  const getDeleteSuccessHandler = (idToBeDeleted) => {
    return () => {
      setNewsletterData((prevState) => {
        _logger("Here's the id to be deleted", idToBeDeleted);
        const prevStateData = { ...prevState };
        prevStateData.newsletterArray = [...prevState.newsletterArray];
        const indexOfDeleteItem = prevStateData.newsletterArray.findIndex(
          (newsletter) => {
            _logger("here's the newsletter", newsletter);
            return parseInt(newsletter.id) === idToBeDeleted;
          }
        );
        _logger(indexOfDeleteItem, "here's the index");
        if (indexOfDeleteItem >= 0) {
          prevStateData.newsletterArray.splice(indexOfDeleteItem, 1);
          prevStateData.newsletterComponents =
            prevStateData.newsletterArray.map(mapNewsletter);
        }

        return prevStateData;
      });
    };
  };

  const mapNewsletter = (newsletter) => {
    return (
      <Col key={newsletter.id} xs={12} sm={6} md={4} lg={4}>
        <NewsletterCard
          newsletter={newsletter}
          onDeleteNewsletterClicked={onDeleteRequested}
        />
      </Col>
    );
  };

  const onChange = (page) => {
    setNewsletterData((prevState) => {
      const newsletterData = { ...prevState };
      newsletterData.page = page;
      return newsletterData;
    });
  };

  return (
    <React.Fragment>
      <div className="container p-2 m-4  d-flex justify-content-center ">
        <div className="row p-2">
          <div className="col p-4 m-4">
            <Pagination
              className="p-2 d-flex justify-content-center "
              onChange={onChange}
              current={newsletterData.page}
              total={newsletterData.totalCount}
              pageSize={newsletterData.pageSize}
            />
            <Row>{newsletterData.newsletterComponents}</Row>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default React.memo(NewsletterView);
