import React, { useState, useEffect } from "react";
import debug from "sabio-debug";
import { Formik, Form, Field, ErrorMessage } from "formik";
import highlightReelService from "services/highlightReelService";
import { HighlightReelSchema } from "schemas/highlightReelSchema";
import { Button } from "reactstrap";
import lookUpService from "services/lookUpService";
import FileUploader from "components/FileUploader";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Swal from "sweetalert2";

const _logger = debug.extend("HighlightReelForm");

const HighlightReelForm = () => {
  const [userFormData, setUserFormData] = useState({
    productId: 0,
    imageUrl: "",
    isApproved: false,
  });
  _logger(userFormData);

  const [products, setProducts] = useState({
    data: [],
    mapped: [],
  });

  const onFormSubmit = (values, { resetForm }) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to upload this photo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, upload it!",
    }).then((result) => {
      if (result.isConfirmed) {
        _logger("Submit form", values);

        const payload = {
          productId: values.productId,
          imageUrl: values.imageUrl,
          isApproved: values.isApproved,
        };

        highlightReelService
          .addPhotos(payload)
          .then((response) => onAddSuccess(response, resetForm))
          .catch(onAddError);
      }
    });
  };

  useEffect(() => {
    lookUpService
      .LookUp(["Products"])
      .then(onGetLookUpSuccess)
      .catch(onGetLookUpError);
  }, []);

  const onGetLookUpSuccess = (data) => {
    let products = data.item.products;
    _logger(products);
    setProducts((prevState) => {
      let pd = { ...prevState };
      pd.data = products;
      pd.mapped = products.map(mapFromLookUp);
      return pd;
    });
  };

  const mapFromLookUp = (aProduct) => {
    return (
      <option key={`product-${aProduct.id}`} value={aProduct.id}>
        {aProduct.name}
      </option>
    );
  };

  const onGetLookUpError = (error) => {
    _logger("Error on lookup Service", error);
    toastr.error("Your products could not be found");
  };

  const onImageUpload = (response, setFieldValue) => {
    _logger("Upload: ", response);
    setFieldValue("imageUrl", response.items[0].url);
  };

  const onAddSuccess = (response, resetForm) => {
    _logger("Image Form success", response);
    Toastify({
      text: "Image Uploaded!",
      className: "Success",
      style: {
        background: "green",
      },
    }).showToast();
    setUserFormData({ ...userFormData });
    resetForm();
  };

  const onAddError = (error) => {
    _logger("Image Form error", error);
    Toastify({
      text: "Image could not be uploaded! Please make sure you have a product selected and an image uploaded.",
      className: "Error",
      style: {
        background: "crimson",
      },
    }).showToast();
  };

  return (
    <div className="container contact-container-bot d-flex flex-column mt-7">
      <h1 className="contact-header top-0 start-100 fw-bold align-self-center fs-5 text-white">
        Highlight Reel
      </h1>
      <p id="quote" className="text-center text-white">
        Upload your Image Here
      </p>
      <div className="card contact-col-bot">
        <Formik
          enableReinitialize={true}
          initialValues={userFormData}
          onSubmit={onFormSubmit}
          validationSchema={HighlightReelSchema}
        >
          {({ setFieldValue, values }) => (
            <Form className="p-3">
              <div className="form-group ">
                <label>Select a Product</label>
                <Field name="productId" as="select" className="form-select">
                  <option name="productId" className="text-muted">
                    Product Name
                  </option>
                  {products?.mapped}
                </Field>
                <ErrorMessage
                  name="productId"
                  component="div"
                  className="has-error"
                ></ErrorMessage>
              </div>
              {values.imageUrl && (
                <div className="text-center">
                  {" "}
                  <img src={values.imageUrl} className="w-40 p-3" alt="" />
                </div>
              )}
              {!values.imageUrl && (
                <div className="form-group">
                  <label>Upload an Image</label>
                  <FileUploader
                    name="imageId"
                    onUploadSuccess={(response) =>
                      onImageUpload(response, setFieldValue)
                    }
                  />
                  <ErrorMessage
                    name="imageId"
                    component="div"
                    className="has-error"
                  ></ErrorMessage>
                </div>
              )}
              <div className="text-center">
                <Button className="btn btn-success " type="submit">
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default HighlightReelForm;
