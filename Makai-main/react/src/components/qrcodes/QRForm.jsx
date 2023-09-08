import React, { useEffect, useState } from "react";
import { Field, Form as FormikForm, Formik, ErrorMessage } from "formik";
import standsService from "services/standsService";
import qrcodeService from "services/qrcodeService";
import { QRCodeSVG } from "qrcode.react";
import { Form, Button, Card, Container, Col, Row } from "react-bootstrap";
import { qrCodesSchema } from "schemas/qrCodesSchema";
import debug from "sabio-debug";
import toastr from "toastr";

const _logger = debug.extend("QRCodes");

function QRForm() {
  const [stands, setStands] = useState({
    initialState: { standId: 0 },
    allStands: [],
    standOptions: [],
    currentStandCode: null,
  });

  useEffect(() => {
    standsService.getAllV2().then(onGetStandsSuccess).catch(onGetStandsError);
  }, []);

  const onGetStandsSuccess = (response) => {
    setStands((prev) => {
      const newState = { ...prev };
      newState.allStands = response.data.items;
      newState.standOptions = response.data.items.map(mappedOptions);
      return newState;
    });
  };

  const onGetStandsError = (err) => {
    _logger({ error: err });
  };

  const mappedOptions = (stand) => {
    return (
      <option
        key={`stand_optionKey_${stand.id}`}
        value={Number(stand.id)}
        name="standId"
      >
        {stand.location.lineOne}
      </option>
    );
  };

  const submitHandler = (values) => {
    qrcodeService
      .addQrCode(values.standId)
      .then(onCreateCodeSuccess)
      .catch(onCreateError);
  };

  const onCreateCodeSuccess = (response) => {
    setStands((prev) => {
      const newState = { ...prev };
      newState.currentStandCode = response;
      return newState;
    });
  };

  const onCreateError = (err) => {
    toastr.error("Could not create QR Code, please try again");
    _logger("couldnt create because: ", err);
  };

  return (
    <>
      <Container className="text-center">
        <Card className="text-center">
          <h1 className="pt-4">Create a QR for your Stand</h1>
          <Row className="mt-4">
            <Col className="col-6 m-3">
              <Formik
                enableReinitialize={true}
                initialValues={stands.initialState}
                validationSchema={qrCodesSchema}
                onSubmit={submitHandler}
              >
                <FormikForm>
                  <Form.Group className="mb-3">
                    <h4>Please choose a Stand</h4>
                    <Field name="standId" as="select" className="form-select">
                      <option name="standId" className="text-muted">
                        Select a stand
                      </option>
                      {stands.standOptions}
                    </Field>
                    <ErrorMessage
                      name="standId"
                      component="div"
                      className="has-error"
                    />
                  </Form.Group>
                  <Form.Group>
                    <Button type="submit" className="w-100 mt-3">
                      Generate QR Code
                    </Button>
                  </Form.Group>
                </FormikForm>
              </Formik>
            </Col>
            <Col className="col-4 mt-3">
              <h4>QR Code</h4>
              {stands.currentStandCode && (
                <Card className="text-center mb-4">
                  <div className="m-4">
                    <QRCodeSVG
                      value={stands.currentStandCode?.item.uniqueCode}
                      size={180}
                      bgColor={"#ffffff"}
                      fgColor={"#000000"}
                      level={"L"}
                      includeMargin={false}
                    />
                  </div>
                </Card>
              )}
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
}

export default QRForm;
