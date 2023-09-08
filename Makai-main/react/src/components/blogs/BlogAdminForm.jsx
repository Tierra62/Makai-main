import React, { useEffect, useState } from "react";
import lookUpService from "services/lookUpService";
import debug from "sabio-debug";
import { Formik, ErrorMessage, Form, Field } from "formik";
import { blogSchema } from "schemas/blogSchema";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDateInput } from "../../utils/dateFormater";
import { addBlog } from "services/blogService";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import BlogPreview from "./BlogPreview";
import { Link } from "react-router-dom";
import FileUploader from "components/FileUploader";

const _logger = debug.extend("adminForm");

function BlogAdminForm() {
  const [blog] = useState({
    title: "",
    subject: "",
    content: "",
    blogCategoryId: "",
    imageUrl: "",
    datePublish: "",
    isPublished: false,
  });

  const [category, setCategory] = useState({
    categoriesMapped: [],
    blogObjForPreview: {},
  });

  useEffect(() => {
    lookUpService
      .LookUp(["BlogCategories"])
      .then(onGetLookUpSuccess)
      .catch(onGetLookUpError);
  }, []);

  const mapFromLookUp = (aCategory) => {
    _logger("mapping", aCategory);
    return (
      <option key={aCategory.id} value={aCategory.id}>
        {aCategory.name}
      </option>
    );
  };
  _logger(category.blogObjForPreview);

  const onGetLookUpError = (error) => {
    _logger("Error on lookup Service", error);
  };

  const onGetLookUpSuccess = (data) => {
    _logger(data);
    let blogCategories = data.item.blogCategories;

    _logger(blogCategories);

    setCategory((prevState) => {
      let pd = { ...prevState };
      pd.categoriesMapped = blogCategories.map(mapFromLookUp);
      pd.blogObjForPreview = blogCategories.reduce(
        (newCategoryObj, aCategory) => {
          newCategoryObj[aCategory.id] = aCategory.name;
          return newCategoryObj;
        },
        {}
      );
      return pd;
    });
  };

  const handleSubmit = (values, { resetForm }) => {
    _logger("handleSubmit", values);

    if (values.imageUrl === "") {
      values.imageUrl =
        "https://sabio-training.s3-us-west-2.amazonaws.com/0c287dc0-5539-4731-a5f2-ff8ab1e56c93/Makai_Rentals_Logo_Blue_No_Background.png";
    }

    if (values.content === "") {
      values.content = null;
    }

    _logger(values.content, "this is what we need");

    if (values.isPublished === false) {
      values.datePublish = null;
    } else {
      values.datePublish = formatDateInput(values.datePublish);
    }

    _logger(values.datePublish, "Here");

    addBlog(values)
      .then((response) => onAddSuccess(response, resetForm))
      .catch(onAddError);
  };

  const onAddSuccess = (response, resetForm) => {
    _logger(response, "Add blog success");

    Toastify({
      text: "Blog has been created",
      className: "Success",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
    resetForm();
  };

  const onAddError = (error) => {
    _logger(error, "Add blog error");

    Toastify({
      text: "Error with creating a blog",
      className: "Error",
      style: {
        background: "linear-gradient(to right, #ff3703, #ff5903)",
      },
    }).showToast();
  };

  const onChangePicture = (setFieldValue, response) => {
    response.items && setFieldValue("imageUrl", response.items[0].url);
  };
  return (
    <React.Fragment>
      <Formik
        enableReinitialize={true}
        initialValues={blog}
        onSubmit={handleSubmit}
        validationSchema={blogSchema}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div className="container-fluid p-0">
              <div className="row">
                <div className="mb-2 col-xl-6 col-lg-12 col-md-12">
                  <div className="card p-3">
                    <div className="form-group">
                      <div>
                        <label className="form-label" htmlFor="titleLabel">
                          Title
                        </label>
                        <Field
                          type="text"
                          name="title"
                          className="form-control"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="subjectLabel">Subject</label>
                      <Field
                        type="text"
                        name="subject"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="subject"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="form-group">
                      <div>
                        <label htmlFor="blogCategoryId">
                          Select a Blog Category
                        </label>
                      </div>
                      <Field
                        as="select"
                        name="blogCategoryId"
                        aria-describedby="enterModel"
                        className="form-group form-select"
                      >
                        <option
                          value="0"
                          label="Category"
                          className="text-muted"
                        >
                          Select a blog category
                        </option>
                        {category.categoriesMapped}
                      </Field>
                      <ErrorMessage
                        name="blogCategoryId"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="form-group mt-1">
                      <label htmlFor="checkBoxLabel">
                        <Field
                          type="checkbox"
                          className="form-check-input"
                          name="isPublished"
                        />
                        Set publish date
                      </label>
                      <ErrorMessage
                        name="isPublished"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    {values.isPublished ? (
                      <div className="form-group fw-bold ">
                        <label htmlFor="datePublishLabel">Date Published</label>
                        <DatePicker
                          showIcon
                          name="datePublish"
                          className="form-control"
                          onChange={(date) => {
                            setFieldValue("datePublish", date);
                          }}
                          selected={values.datePublish}
                        />

                        <ErrorMessage
                          name="datePublish"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                    ) : null}

                    <div className="form-group">
                      <label htmlFor="content">Content</label>
                      <CKEditor
                        editor={ClassicEditor}
                        data={values.content}
                        onChange={(event, editor) => {
                          const data = editor.getData();

                          _logger({ event, editor, data });
                          setFieldValue("content", data);
                        }}
                        onReady={(editor) => {
                          editor.editing.view.change((writer) => {
                            writer.setStyle(
                              "height",
                              "200px",
                              editor.editing.view.document.getRoot()
                            );
                          });
                        }}
                      />
                    </div>

                    <div>
                      <div className="form-group">
                        <label htmlFor="blogUrlLabel">
                          Upload an image for your blog.
                        </label>
                        <div>
                          <FileUploader
                            onUploadSuccess={(response) =>
                              onChangePicture(setFieldValue, response)
                            }
                          />
                        </div>
                        <ErrorMessage
                          name="imageUrl"
                          component="div"
                          className="text-danger"
                        ></ErrorMessage>
                      </div>
                    </div>

                    <div className="mt-3">
                      <button type="submit" className="btn btn-primary  btn-sm">
                        Submit
                      </button>
                      <Link to="/blogs">
                        <button className="btn btn-secondary btn-sm float-end">
                          All Blogs
                        </button>
                      </Link>
                    </div>
                    <div className="float-right"> </div>
                  </div>
                </div>
                <div className="mb-2 col-xl-6 col-lg-12 col-md-12">
                  <div className="card p-3">
                    <BlogPreview
                      data={{
                        ...values,
                        blogCategory:
                          category.blogObjForPreview[values.blogCategoryId],
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
}

export default BlogAdminForm;
