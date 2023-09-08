import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FaqAccordionItem from "./FaqAccordionItem";
import faqsService from "../../services/faqsService";
import FaqCategory from "./FaqCategory";
import lookUpService from "services/lookUpService";
import toastr from "toastr";
function Faqs(props) {
  const [faqsData, setFaqsData] = useState({
    faqs: [],
    faqsComponents: [],
  });

  const [faqsCategoryData, setFaqsCategoryData] = useState({
    faqsCategory: [],
    faqsCategoryComponents: [],
  });

  useEffect(() => {
    lookUpService
      .LookUp(["FAQCategories"])
      .then(onGetCategorySuccess)
      .catch(onGetCategoryError);
  }, []);

  useEffect(() => {
    faqsService.getFaqs().then(onGetFaqsSuccess).catch(onGetFaqsError);
  }, []);

  const handleCategoryChange = (categoryId) => {
    const filtered = faqsData.faqs.filter(
      (faq) => faq.faqCategories.id === categoryId
    );
    setFaqsData((prevState) => {
      const pageData = { ...prevState };

      pageData.faqsComponents = filtered.map(mapFaqs);

      return pageData;
    });
  };

  const mapFaqCategory = (aFaqCategory) => {
    return (
      <FaqCategory
        onCategoryChange={handleCategoryChange}
        faqCategory={aFaqCategory}
        key={"ListFaqsCategories" + aFaqCategory.id}
      />
    );
  };

  const onGetCategorySuccess = (item) => {
    const arrayOfFaqsCategories = item.item.faqCategories;

    setFaqsCategoryData((prevState) => {
      const categoryItem = { ...prevState };

      categoryItem.faqsCategory = arrayOfFaqsCategories;
      categoryItem.faqsCategoryComponents =
        arrayOfFaqsCategories.map(mapFaqCategory);

      return categoryItem;
    });
  };

  const onGetCategoryError = () => {
    toastr.error("Cant load Categories");
  };

  const mapFaqs = (aFaq) => {
    return (
      <FaqAccordionItem
        faq={aFaq}
        key={"ListFaqs" + aFaq.id}
        user={props.currentUser}
      />
    );
  };

  const onGetFaqsSuccess = (data) => {
    const arrayOfFaqs = data.items;

    setFaqsData((prevState) => {
      const pageData = { ...prevState };

      pageData.faqs = arrayOfFaqs;
      pageData.faqsComponents = arrayOfFaqs.map(mapFaqs);

      return pageData;
    });
  };

  const onGetFaqsError = () => {
    toastr.error("Can't load FAQs");
  };

  return (
    <React.Fragment>
      <div className="mt-5 mb-5 text-center">
        <h1 className="container mt-5 mb-5 text-center text-decoration-underline fst-italic text-primary">
          <strong>Frequently Asked Questions</strong>
        </h1>
      </div>
      <div className="container mb-5 text-center mt-5">
        {faqsCategoryData.faqsCategory?.map(mapFaqCategory)}
      </div>
      <div className="row">{faqsData.faqsComponents}</div>
    </React.Fragment>
  );
}

Faqs.propTypes = {
  currentUser: PropTypes.shape({}),
};

export default Faqs;
