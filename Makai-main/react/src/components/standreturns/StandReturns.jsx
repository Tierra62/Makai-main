import React, { useState } from "react";
import { Formik, Form as FormikForm, Field } from "formik";
import { FormGroup, Label, Button, Container, Modal } from "reactstrap";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import Camera from "./Camera";
import standReturnService from "../../services/standReturnService";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const _logger = debug.extend("StandReturns");
function StandReturns(props) {
  const currentUser = props.currentUser;
  _logger(currentUser);
  const [show, setShow] = useState(false);
  const [userReturn] = useState({
    StandId: 0,
    ImageName: "Return Picture",
    ImageUrl: "",
    ImageTypeId: 7,
    CreatedBy: currentUser.id,
    IsDamaged: false,
  });

  const showCamera = () => {
    setShow(true);
  };

  const location = [
    {
      Id: 1,
      LineOne: "7500 Collins Avenue",
      LineTwo: "North Beach",
      City: "Miami Beach",
      Zip: 33141,
      State: "Florida",
    },
    {
      Id: 2,
      LineOne: "3500 Collins Avenue",
      LineTwo: "North Beach",
      City: "Miami Beach",
      Zip: 33141,
      State: "Florida",
    },
    {
      Id: 36,
      LineOne: "123 Melrose Street",
      LineTwo: "BushWick",
      City: "city",
      Zip: 33141,
      State: "Kansas",
    },
  ];

  const mapLocations = (stand) => (
    <option value={stand.Id} key={`location_${stand.Id}`}>
      {`${stand.LineOne} ${stand.LineTwo} ${stand.City}`}
    </option>
  );

  const submitReturn = (values) => {
    _logger(values);
    standReturnService.add(values).then(onAddSuccess).catch(onAddError);
  };

  const onAddSuccess = (response) => {
    _logger(response);
    Toastify({
      text: "Your Product has been returned.",
      className: "success",
      style: {
        background: "blue",
      },
      duration: 2000,
    }).showToast();
  };

  const onAddError = (error) => {
    _logger(error);
    Toastify({
      text: "Please make sure to fill in the whole form.",
      className: "error",
      style: {
        background: "red",
      },
      duration: 2000,
    }).showToast();
  };

  return (
    <Container>
      <Formik
        enableReinitialize={true}
        initialValues={userReturn}
        onSubmit={submitReturn}
      >
        {({ setFieldValue }) => (
          <FormikForm>
            {show && (
              <Modal isOpen={show}>
                <Camera
                  onUploadSuccess={(imageUrl) => {
                    setFieldValue("ImageUrl", imageUrl);
                    setShow(false);
                  }}
                />
              </Modal>
            )}
            <FormGroup>
              <div className="form-control">
                <Label for="standId">Stands</Label>
                <Field
                  component="select"
                  name="StandId"
                  className="form-control"
                >
                  <option value="">Select Location</option>
                  {location.map(mapLocations)}
                </Field>
              </div>
            </FormGroup>
            <FormGroup>
              <div>
                <Label for="takingPicture">Take picture of Product</Label>
              </div>
              <Button onClick={showCamera}>Take Picture</Button>
            </FormGroup>
            <FormGroup>
              <Label for="isDamaged">Check box if product is Not Damaged</Label>
              <div className="form-check">
                <Field
                  name="IsDamaged"
                  type="checkbox"
                  className="form-check-label"
                />
                <label className="form-check-label"></label>
              </div>
            </FormGroup>
            <Button>Submit</Button>
          </FormikForm>
        )}
      </Formik>
    </Container>
  );
}

StandReturns.propTypes = {
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    role: PropTypes.string,
  }),
};

export default StandReturns;
