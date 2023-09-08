import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDateTime } from "utils/dateFormater";
import createMarkup from "helpers/createMarkup";
import "./blogs.css";

const BlogDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [blogState] = useState(state);

  const goBack = () => {
    navigate("/blogs");
  };
  createMarkup = () => {
    return { __html: blogState.content };
  };

  return (
    <div className="mx-auto blog-width ">
      {
        <div className="col-12">
          <div className="overflow-hidden card">
            <div className="p-0 card-body">
              <div className="g-0 row">
                <div className="col-lg-3 col-md-4 fit-top">
                  <div className="hoverbox h-md-100">
                    <div className="p-0 border-0 h-100 btn btn-link">
                      <img
                        src={blogState?.imageUrl}
                        alt="Picture"
                        className="w-100 h-100 fit-cover "
                      />
                    </div>
                  </div>
                </div>
                <div className="p-x1 col-lg-9 col-md-8">
                  <div className="g-0 h-100 row">
                    <div className="d-flex flex-column pe-x1 col-lg-8">
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <div className="mx-auto badge badge-soft-primary rounded-pill">
                          <h2>{blogState?.categoryType.name}</h2>
                        </div>
                        <div className="badge badge-soft-warning rounded-pill"></div>
                      </div>
                      <h5 className="fs-0">
                        <div>{blogState?.subject}</div>
                      </h5>
                      <h1 className="mt-3 mt-sm-0 fs-0 fs-lg-1">
                        <div className="text-900">{blogState?.title}</div>
                      </h1>
                      <div
                        type="text"
                        className="fs-1 mt-2 d-none d-lg-block blog-avaImg"
                      >
                        <div
                          dangerouslySetInnerHTML={createMarkup()}
                          className="editor"
                        ></div>
                      </div>
                      <div className="flex-1 d-flex align-items-end fw-semi-bold fs-1">
                        <span className="me-1 text-900"> </span>
                        <span className="d-inline-block dir-ltr">
                          <span className="blog-text">
                            <span className="invisible">
                              <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="star"
                                className="svg-inline-fa fa-star text-300"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                              >
                                <path
                                  fill="currentColor"
                                  d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                                />
                              </svg>
                            </span>
                            <span className="blog-author">
                              <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="star"
                                className="svg-inline-fa fa-star text-warning"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                              >
                                <path
                                  fill="currentColor"
                                  d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                                />
                              </svg>
                            </span>
                          </span>
                          <span className="blog-text">
                            <span className="invisible">
                              <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="star"
                                className="svg-inline-fa fa-star text-300"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                              >
                                <path
                                  fill="currentColor"
                                  d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                                />
                              </svg>
                            </span>
                            <span className="blog-author">
                              <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="star"
                                className="svg-inline-fa fa-star text-warning"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                              >
                                <path
                                  fill="currentColor"
                                  d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                                />
                              </svg>
                            </span>
                          </span>
                          <span className="blog-text">
                            <span className="invisible">
                              <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="star"
                                className="svg-inline-fa fa-star text-300"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                              >
                                <path
                                  fill="currentColor"
                                  d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                                />
                              </svg>
                            </span>
                            <span className="blog-author">
                              <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="star"
                                className="svg-inline-fa fa-star text-warning"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                              >
                                <path
                                  fill="currentColor"
                                  d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                                />
                              </svg>
                            </span>
                          </span>
                          <span className="blog-text">
                            <span className="invisible">
                              <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="star"
                                className="svg-inline-fa fa-star text-300"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                              >
                                <path
                                  fill="currentColor"
                                  d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                                />
                              </svg>
                            </span>
                            <span className="blog-author">
                              <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="star"
                                className="svg-inline-fa fa-star text-warning"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                              >
                                <path
                                  fill="currentColor"
                                  d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                                />
                              </svg>
                            </span>
                          </span>
                          <span className="blog-text">
                            <span>
                              <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="star"
                                className="svg-inline-fa fa-star text-300"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                              >
                                <path
                                  fill="currentColor"
                                  d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                                />
                              </svg>
                            </span>
                          </span>
                        </span>
                        <div className="pt-4 align-items-center mx-auto">
                          <div className="mx-auto badge badge-soft-success rounded-pill">
                            Published:{" "}
                            {`${formatDateTime(blogState?.datePublish).slice(
                              0,
                              12
                            )}`}
                          </div>
                        </div>
                      </div>
                      <div className="align-items-center mx-auto pt-3">
                        <button className="btn btn-primary" onClick={goBack}>
                          Blog Home Page
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 mt-lg-0 col-lg-4 d-flex justify-content-center">
                      <div className="d-flex justify-content-between h-100 rounded border-lg border-1 flex-lg-column p-lg-3">
                        <p className="ms-2 fs-1 text-700 text-center">
                          Author{" "}
                          <h4 className="pt-3 fs-1 text-warning text-center mx-auto fit-important d-flex align-items-center blog-avaImg">
                            {blogState?.author.firstName} {blogState?.author.mi}{" "}
                            {blogState?.author.lastName}
                          </h4>
                        </p>
                        <img
                          src={blogState?.author.avatarUrl}
                          alt="Author"
                          className="w-100 h-100 fit-cover"
                        />
                        <div className="mb-0 fs-1 text-800">
                          <h4 className="fs-1 text-warning d-flex align-items-center"></h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};
export default BlogDetail;
