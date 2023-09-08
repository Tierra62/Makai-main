import React, { useState, useEffect, useCallback } from "react";
import newsletterSubscriptionService from "services/newsletterSubscriptionService";
import sabioDebug from "sabio-debug";
import Subscriber from "./Subscriber";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const _logger = sabioDebug.extend("NewsletterAdmin");

function NewsletterAdmin() {
  const [pageData, setPageData] = useState({
    arrayOfSubscribers: [],
    subscriberComponents: [],
    selectedFilter: "",
    pageSize: 7,
    totalCount: 0,
    current: 1,
  });

  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    if (toggle === "Subscribed") {
      newsletterSubscriptionService
        .getAllSubscribed(pageData.current - 1, pageData.pageSize)
        .then(successHandler)
        .catch(errorHandler);
    } else if (toggle === "NotSubscribed") {
      newsletterSubscriptionService
        .getAllNotSubscribed(pageData.current - 1, pageData.pageSize)
        .then(successHandler)
        .catch(errorHandler);
    } else {
      newsletterSubscriptionService
        .getAll(pageData.current - 1, pageData.pageSize)
        .then(successHandler)
        .catch(errorHandler);
    }
  }, [pageData.current, toggle]);

  const onEditRequested = useCallback((aSub, aSubEmail, eObj) => {
    _logger("Edit", { aSub, aSubEmail, eObj });
    const newStatus = !aSub.isSubscribed;
    const payload = { email: aSubEmail, isSubscribed: newStatus };
    newsletterSubscriptionService
      .edit(payload)
      .then(successHandler)
      .catch(editErrorHandler);
  });

  const successHandler = (data) => {
    _logger("GetAllSub success", data);
    let arrayOfCapturedSubscribers = data.item.pagedItems;
    _logger({ arrayOfCapturedSubscribers });

    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.arrayOfSubscribers = arrayOfCapturedSubscribers;
      pd.subscriberComponents = arrayOfCapturedSubscribers.map(mapSubscribers);
      pd.totalCount = data.item.totalCount;
      return pd;
    });
  };

  const errorHandler = (error) => {
    toast.error("No subscribers found", {
      position: toast.POSITION.TOP_RIGHT,
    });
    _logger("subscribers error", error.response);
  };

  const editErrorHandler = (error) => {
    _logger("edit subscribers error", error.response);
  };

  const mapSubscribers = (aSubscriber) => {
    return (
      <Subscriber
        subscriber={aSubscriber}
        key={"SubscriptionList-" + aSubscriber.email}
        onSubscriberClicked={onEditRequested}
      />
    );
  };

  const onSelectToggleContent = (event) => {
    const selectedFilter = event.target.value;
    _logger("selectedFilter", selectedFilter);
    setToggle(selectedFilter);
  };

  const handlePageClicked = (page) => {
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.current = page;
      return pd;
    });
  };

  return (
    <div className="table-responsive scrollbar">
      <div className="row justify-content-end g-0">
        <div className="col-auto px-3">
          <select
            onChange={onSelectToggleContent}
            className="form-select form-select-sm mb-3"
            aria-label="Bulk actions"
            data-list-filter="data-list-filter"
          >
            {" "}
            {toggle ? "Subscribed" : "NotSubscribed"}
            <option value="ShowAll">Show All</option>
            <option value="Subscribed">Subscribed</option>
            <option value="NotSubscribed">Not Subscribed</option>
          </select>
        </div>
      </div>
      <table className="table table-striped overflow-hidden">
        <thead className="bg-400">
          <tr className="btn-reveal-trigger">
            <th scope="col">Email</th>
            <th scope="col">Subscription Date</th>
            <th scope="col">Status</th>
            <th className="text-end" scope="col">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-200">{pageData.subscriberComponents}</tbody>
      </table>
      <div>
        <Pagination
          className="pagination"
          onChange={handlePageClicked}
          current={pageData.current}
          locale={locale}
          total={pageData.totalCount}
          pageSize={pageData.pageSize}
        />
      </div>
      <ToastContainer />
    </div>
  );
}

export default NewsletterAdmin;
