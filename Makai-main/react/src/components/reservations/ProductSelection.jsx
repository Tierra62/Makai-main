import { React, useState, useEffect } from "react";
import { reservationProductSchema } from "schemas/reservationSchema";
import { withFormik, Form, Field, ErrorMessage } from "formik";
import { Card, Row, Col, Button } from "react-bootstrap";
import productService from "services/productService";
import Swal from "sweetalert2";
import "../landing/Landing.css";
import PropTypes from "prop-types";

const ProductSelection = (props) => {
  const {
    nextLabel,
    isSubmitting,
    backLabel,
    onBack,
    cantBack,
    handleSubmit,
    handleBlur,
    handleChange,
    reservation,
  } = props;

  const [products, setProducts] = useState([]);
  useEffect(() => {
    productService
      .getByStandId(reservation.standId)
      .then(onGetAllSuccess)
      .catch(onGetAllError);
  }, []);

  const onGetAllSuccess = (response) => {
    setProducts((prevState) => {
      let productsList = { ...prevState };
      productsList = response.data.item;
      return productsList;
    });
  };

  const onGetAllError = () => {
    Swal.fire(
      "No products found!",
      "There are no products available at this stand location. Please try again later.",
      "error",
      { button: "Ok" }
    ).then;
    onBack();
  };
  const mapProducts = (aProduct) => {
    if (aProduct.statusType.id === 1) {
      const dollars = (aProduct.hourlyPriceInCents / 100).toLocaleString(
        "en-US",
        {
          style: "currency",
          currency: "USD",
        }
      );
      return (
        <option value={aProduct.id} key={`product_${aProduct.id}`}>
          {aProduct.name} - {dollars}/hr
        </option>
      );
    }
  };

  const productsToMap = products.map(mapProducts);

  return (
    <Card.Body>
      <Row className="mb-5 d-flex justify-content-center">
        <Col lg={10} md={10} sm={12}>
          <Form onSubmit={handleSubmit}>
            <h4 className="mb-3">Select a Product</h4>
            <div className="form-group mb-2">
              <label htmlFor="productId" className="form-label">
                Product Selection
              </label>
              <Field
                as="select"
                className="form-select"
                name="productId"
                selected=""
                id="productId"
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select your product ...</option>
                {productsToMap}
              </Field>
              <ErrorMessage
                name="productId"
                component="div"
                className="has-error"
              />
            </div>

            <div className="button-group">
              <Button
                type="button"
                className="btn btn-secondary float-start mt-2 listing-loki-actions"
                onClick={onBack}
                disabled={isSubmitting || cantBack}
              >
                {backLabel}
              </Button>
              <Button
                type="submit"
                className="btn btn-secondary float-end mt-2 listing-loki-actions"
                disabled={isSubmitting}
              >
                {nextLabel}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Card.Body>
  );
};

export default withFormik({
  mapPropsToValues: (props) => ({
    productId: props.reservation.productId,
    dateCheckIn: props.reservation.dateCheckIn,
    rentalTime: props.reservation.rentalTime,
    chargeId: props.reservation.chargeId,
    statusId: props.reservation.statusId,
    standId: props.reservation.standId,
  }),
  validationSchema: reservationProductSchema,
  handleSubmit: function (values, { props }) {
    props.onNext(values);
  },
})(ProductSelection);

ProductSelection.propTypes = {
  reservation: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    dateCheckIn: PropTypes.instanceOf(Date).isRequired,
    rentalTime: PropTypes.number.isRequired,
    chargeId: PropTypes.string.isRequired,
    statusId: PropTypes.number.isRequired,
    standId: PropTypes.number.isRequired,
  }),

  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onNext: PropTypes.func.isRequired,
  nextLabel: PropTypes.string.isRequired,
  backLabel: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  cantBack: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  setReservation: PropTypes.func,
  values: PropTypes.shape({
    productId: PropTypes.string.isRequired,
  }),
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};
