import React from "react";
import propTypes from "prop-types";
import createMarkup from "helpers/createMarkup";

function BlogPreview(props) {
  const blog = props.data;
  createMarkup = () => {
    return { __html: blog.content };
  };

  return (
    <div className="col-12">
      <div className=" card-body">
        <div className="row">
          <div
            className="card-img-top d-flex justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <div className="p-0 border-0 w-100 h-100 ">
              <img
                src={
                  blog.imageUrl
                    ? blog.imageUrl
                    : "https://trello.com/1/cards/63f55215ac3814bd7bf15df0/attachments/63f55215ac3814bd7bf15e8e/download/Makai_Rentals_Logo_Blue_No_Background.png"
                }
                alt="Picture"
                className="w-100 h-100 fit-cover rounded"
              />
            </div>
          </div>

          <div>
            <div className="g-0 h-100 row">
              <div className="flex-column pe-x1">
                <h4
                  className="mt-3 fs-0 fs-lg-1"
                  style={{ backgroundColor: "transparent" }}
                >
                  <div className="text-900">{blog.title}</div>
                </h4>
                <h5 className="fs-0 mb-3">
                  <div>{blog.subject}</div>
                </h5>
                <div className="d-flex flex-wrap  mb-3">
                  <div className="badge badge-soft-primary rounded-pill">
                    {blog.blogCategory}
                  </div>
                  <div className="badge badge-soft-warning rounded-pill"></div>
                </div>
                <p className="badge badge-soft-success rouded-pill">
                  {blog.datePublish.toLocaleString().slice(0, 9)}
                </p>
                <div
                  dangerouslySetInnerHTML={createMarkup()}
                  className="editor fs-1 mb-3 d-none d-lg-block"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

BlogPreview.propTypes = {
  data: propTypes.shape({
    title: propTypes.string.isRequired,
    subject: propTypes.string.isRequired,
    blogCategory: propTypes.string,
    datePublish: propTypes.string,
    content: propTypes.string,
    imageUrl: propTypes.string,
  }),
};
export default React.memo(BlogPreview);
