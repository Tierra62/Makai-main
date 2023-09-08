import React from "react";
import { useEffect, useState } from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import {
  Button,
  Col,
  Form,
  Row,
  Container,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import sabioDebug from "sabio-debug";
import { Link } from "react-router-dom";
import { advertisementSchema } from "schemas/advertisementFormSchema";
import swal from "sweetalert";
import toastr from "toastr";
import advertisementService from "services/advertisementService";
import { useLocation } from "react-router-dom";
import lookUpService from "services/lookUpService";
import { formatDateInput } from "../../utils/dateFormater";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faTh } from "@fortawesome/free-solid-svg-icons";
import AdvertisementPreview from "./AdvertisementPreview";
import "./Advertisement.css";
const _logger = sabioDebug.extend("advertisement");
const AdvertisementsForm = () => {
  const [formData, setFormData] = useState({
    productId: 12,
    title: "",
    adMainImage: "",
    details: "",
    dateStart: "",
    dateEnd: "",
  });

  const [products, setProducts] = useState({
    productsMapped: [],
    productPreview: {},
  });

  const onSubmitAdvertisement = (data) => {
    _logger(data);
    if (formData.id) {
      advertisementService
        .onUpdateAdvertisement(data.id, data)
        .then(onUpdateAdSuccess)
        .catch(onUpdateAdError);
    } else {
      advertisementService
        .advertisementInsert(data)
        .then(onSubmitAdSuccess)
        .catch(onSubmitAdError);
    }
  };
  const onSubmitAdSuccess = (response) => {
    _logger(response);
    swal({
      title: "Advertisement add was successful!",
      icon: "success",
    });
  };
  const onSubmitAdError = (error) => {
    _logger(error);
    swal("Advertisement add was unsuccessful", "Please try again.", "error");
  };

  const onUpdateAdSuccess = (response) => {
    _logger(response);
    swal({
      title: "Advertisement edit was successful!",
      icon: "success",
    });
  };
  const onUpdateAdError = (error) => {
    _logger(error);
    swal("Advertisement edit was unsuccessful", "Please try again.", "error");
  };

  const location = useLocation();

  useEffect(() => {
    if (
      location?.state?.type === "Advertisement_Edit" &&
      location.state.payload
    ) {
      setFormData((prevState) => {
        _logger(prevState, location.state.payload);
        const advertisement = { ...prevState, ...location.state.payload };
        advertisement.dateStart = formatDateInput(advertisement.dateStart);
        advertisement.dateEnd = formatDateInput(advertisement.dateEnd);
        return advertisement;
      });
    }
  }, []);

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
      pd.productsMapped = products.map(mapFromLookUp);
      pd.productPreview = products.reduce((newProductObj, aProduct) => {
        newProductObj[aProduct.id] = aProduct.name;
        return newProductObj;
      }, {});
      return pd;
    });
  };

  const mapFromLookUp = (aProduct) => {
    return (
      <option key={aProduct.id} value={aProduct.id}>
        {aProduct.name}
      </option>
    );
  };

  const onGetLookUpError = (error) => {
    _logger("Error on lookup Service", error);
    toastr.error("Your products could not be found");
  };

  return (
    <Container className="p-0">
      <Formik
        enableReinitialize={true}
        initialValues={formData}
        validationSchema={advertisementSchema}
        onSubmit={onSubmitAdvertisement}
      >
        {({ values }) => (
          <Row>
            <FormikForm className="mb-2 col-xl-6 col-lg-12 col-md-12">
              <Col xs="auto" className="p-0">
                <Row className="g- align-items-center">
                  <Col xs="auto">
                    <OverlayTrigger
                      placement="left"
                      overlay={<Tooltip>Advertisement Grid</Tooltip>}
                    >
                      <Link
                        to="/advertisements/list"
                        className={`me-3`}
                        id="grid-icon"
                      >
                        <FontAwesomeIcon
                          icon={faTh}
                          transform="down-3"
                          className="fs-1 icongrid advertisement-icongrid2"
                        />
                      </Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="left"
                      className="tooltip"
                      overlay={<Tooltip>Advertisement List Table</Tooltip>}
                    >
                      <Link
                        to="/advertisements/table"
                        className={`me-2`}
                        id="table-icon"
                      >
                        <FontAwesomeIcon
                          icon={faList}
                          transform="down-3"
                          className="fs-1 iconlist advertisement-iconlist2 hover-700"
                        />
                      </Link>
                    </OverlayTrigger>
                  </Col>
                </Row>
              </Col>

              <Form.Group className="mb-3">
                <Form.Label>Select Product</Form.Label>
                <Field name="productId" as="select" className="form-select">
                  <option name="productId" className="text-muted">
                    Product Name
                  </option>
                  {products.productsMapped}
                </Field>
                <ErrorMessage
                  name="productId"
                  component="div"
                  className="has-error"
                ></ErrorMessage>
              </Form.Group>
              <Row className="g-2 mb-3">
                <Form.Group className="mb-3" as={Col} sm={6}>
                  <Form.Label htmlFor="title"> Title</Form.Label>
                  <Field
                    name="title"
                    type="text"
                    className="form-control"
                  ></Field>
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="has-error"
                  ></ErrorMessage>
                </Form.Group>
                <Form.Group className="mb-3" as={Col} sm={6}>
                  <Form.Label htmlFor="adMainImage">
                    Advertisement Main Image
                  </Form.Label>
                  <Field
                    name="adMainImage"
                    type="text"
                    className="form-control"
                  ></Field>
                  <ErrorMessage
                    name="adMainImage"
                    component="div"
                    className="has-error"
                  ></ErrorMessage>
                </Form.Group>
              </Row>
              <Row className="g-2 mb-3">
                <Form.Group className="mb-3" as={Col} sm={6}>
                  <Form.Label htmlFor="dateStart">Date Start</Form.Label>
                  <Field
                    name="dateStart"
                    type="date"
                    className="form-control"
                  ></Field>
                  <ErrorMessage
                    name="dateStart"
                    component="div"
                    className="has-error"
                  ></ErrorMessage>
                </Form.Group>
                <Form.Group className="mb-3" as={Col} sm={6}>
                  <Form.Label htmlFor="dateEnd">Date End</Form.Label>
                  <Field
                    name="dateEnd"
                    type="date"
                    className="form-control"
                  ></Field>
                  <ErrorMessage
                    name="dateEnd"
                    component="div"
                    className="has-error"
                  ></ErrorMessage>
                </Form.Group>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="details"> Details </Form.Label>
                <Field
                  name="details"
                  type="textarea"
                  className="form-control"
                ></Field>
                <ErrorMessage
                  name="details"
                  component="div"
                  className="has-error"
                ></ErrorMessage>
              </Form.Group>
              <Form.Group className="mb-4">
                <Button className="w-100" type="submit">
                  {formData.id ? "Edit" : "Submit"}
                </Button>
              </Form.Group>
            </FormikForm>
            <FormikForm className="mb-2 col-xl-6 col-lg-12 col-md-12 advertisement-form-card">
              <AdvertisementPreview
                advertisement={{
                  ...values,
                  product: products.productPreview[values.productId],
                }}
              ></AdvertisementPreview>
            </FormikForm>
          </Row>
        )}
      </Formik>
    </Container>
  );
};
export default AdvertisementsForm;
