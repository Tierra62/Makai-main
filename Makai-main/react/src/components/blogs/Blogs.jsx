import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import * as blogService from "../../services/blogService";
import lookUpService from "services/lookUpService";
import debug from "sabio-debug";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const _logger = debug.extend("Blogs");

function Blogs() {
  const [pageData, setPageData] = useState({
    searchTerm: "",
    categories: [],
    selectedCategoryId: "",
    blogsComponent: [],
    pageIndex: 0,
    pageSize: 3,
    totalCount: 0,
    currentPage: 1,
  });

  useEffect(() => {
    lookUpService
      .LookUp(["BlogCategories"])
      .then(onGetCategoriesSuccess)
      .catch(onBlogsError);
  }, []);

  useEffect(() => {
    if (!pageData.searchTerm) {
      if (!pageData.selectedCategoryId) {
        blogService
          .getBlogs(pageData.pageIndex, pageData.pageSize)
          .then(onBlogsSuccess)
          .catch(onBlogsError);
      } else {
        blogService
          .getByCategoryId(
            pageData.selectedCategoryId,
            pageData.pageIndex,
            pageData.pageSize
          )
          .then(onBlogsSuccess)
          .catch(onBlogsError);
      }
    } else {
      blogService
        .searchBlog(0, pageData.pageSize, pageData.searchTerm)
        .then(onBlogsSuccess)
        .catch(onBlogsError);
    }
  }, [pageData.searchTerm, pageData.selectedCategoryId, pageData.pageIndex]);

  const mapBlogs = (ablog) => {
    return <BlogCard key={`${ablog.id}`} blog={ablog} />;
  };

  const mapOption = (category) => {
    return (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    );
  };

  const onPageChange = (page) => {
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.currentPage = page;
      pd.pageIndex = page - 1;
      return pd;
    });
  };

  const onSearchTermChange = (e) => {
    const target = e.target;
    const newValue = target.value;
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.pageIndex = 0;
      pd.searchTerm = newValue;
      return pd;
    });
  };

  const onGetCategoriesSuccess = (data) => {
    _logger(data, "Data for the option select");
    const arrayOfBlogs = data.item.blogCategories;
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.categories = arrayOfBlogs;
      return pd;
    });
  };

  const onCategoryTypeChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.selectedCategoryId = selectedId;
      return pd;
    });
  };

  const onBlogsSuccess = (response) => {
    setPageData((prevState) => {
      const pd = { ...prevState };
      pd.blogsComponent = response.item?.pagedItems?.map(mapBlogs);
      pd.totalCount = response.item?.totalCount;
      return pd;
    });
  };

  const onBlogsError = (error) => {
    _logger(error);
    Toastify({
      text: "Unable to fulfill request!",
      className: "error",
      style: {
        background: "linear-gradient(to right, #B00000, #B00000)",
      },
    }).showToast();
  };

  return (
    <div className="container">
      <div className="row mx-auto my-5 text-center">
        <div className=" mx-auto my-5 text-center">
          <div className="mb-3">
            <h2 className="text-white">Blogs</h2>
          </div>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-3 search-bar">
          <div className="input-group mb-3">
            <input
              className="form-control form-searchCat"
              type="text"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              onChange={onSearchTermChange}
              value={pageData.searchTerm}
            />
            <button
              className="btn btn-outline-secondary mx-auto"
              type="button"
              id="button-addon2"
            >
              Search
            </button>
          </div>
        </div>
        <div className="col-4 search-bar justify-content-center">
          <select
            className="form-control text-center"
            value={pageData.selectedCategoryId}
            onChange={onCategoryTypeChange}
          >
            <option value={""}>All Categories</option>
            {pageData.categories.map(mapOption)}
          </select>
        </div>
      </div>
      <div className="row">
        <div className="mb-3 g-3 row">{pageData.blogsComponent}</div>
        <div className="d-flex justify-content-center">
          <Pagination
            className="pagination"
            onChange={onPageChange}
            current={pageData.pageIndex + 1}
            locale={locale}
            total={pageData.totalCount}
            pageSize={pageData.pageSize}
          />
        </div>
      </div>
    </div>
  );
}

export default Blogs;
