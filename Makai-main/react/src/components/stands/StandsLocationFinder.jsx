import Flex from "components/common/Flex";
import { Form as FormikForm, Formik, Field, ErrorMessage } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import debug from "sabio-debug";
import LocationFinderCard from "./LocationFinderCard";
import Pagination from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";
import "rc-pagination/assets/index.css";
import standsService from "../../services/standsService";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import "./stands.css";
import { standSchema } from "../../schemas/standSchema";

const _logger = debug.extend("StandLocationFinder");
const GOOGLE_AUTOCOMPLTE_APIKEY = process.env.REACT_APP_GOOGLE_AUTO_COMPLETE;
const libraries = ["places"];

function StandsLocationFinder() {
  false && _logger("test", geoFormValues, standData, setStandData, isLoaded);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_AUTOCOMPLTE_APIKEY,
    libraries: libraries,
  });

  const [serviceData, setServiceData] = useState({
    latitude: 1,
    longitude: 1,
    distance: 5,
  });

  const [autoComplete, setAutoComplete] = useState();

  // geocoder
  const onPlaceChanged = () => {
    if (autoComplete) {
      const place = autoComplete.getPlace();
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setServiceData((prevState) => {
        const newData = { ...prevState };
        newData.latitude = lat;
        newData.longitude = lng;
        return newData;
      });
    }
  };

  const autoCompleteConfig = {
    componentRestrictions: { country: "us" },
    fields: ["geometry.location"],
  };

  const onLoad = (autocomplete) => {
    setAutoComplete(autocomplete);
  };

  const geoFormValues = {
    address: "",
    distance: "",
  };

  const [standData, setStandData] = useState({
    arrayOfStands: [],
    standComponents: [],
    page: 1,
    pageSize: 5,
    totalCount: 0,
  });

  const mapStands = (stand) => {
    return <LocationFinderCard standData={stand} key={`ListA-${stand.id}`} />;
  };

  const handleSubmit = (values) => {
    setStandData((prevState) => {
      const newData = { ...prevState };
      newData.distance = values.distance;
      return newData;
    });

    const payload = {
      pageIndex: standData.page - 1,
      pageSize: standData.pageSize,
      latitude: serviceData.latitude,
      longitude: serviceData.longitude,
      distance: values.distance,
    };

    standsService
      .getByGeo(payload)
      .then(onGetByGeoSuccess)
      .catch(onGetByGeoError);
  };

  const onGetByGeoSuccess = (data) => {
    _logger(data);
    const newStandArray = data.item.pagedItems;
    const totalCount = data.item.totalCount;

    setStandData((prevState) => {
      const standData = { ...prevState };
      standData.arrayOfStands = newStandArray;
      standData.standComponents = newStandArray.map(mapStands);
      standData.totalCount = totalCount;
      return standData;
    });
  };

  const onGetByGeoError = (error) => {
    _logger("error", error);
  };

  const onPageChange = (page) => {
    setStandData((prevState) => {
      const standData = { ...prevState };
      standData.page = page;
      return standData;
    });
  };

  useEffect(() => {
    const payload = {
      pageIndex: standData.page - 1,
      pageSize: standData.pageSize,
      latitude: serviceData.latitude,
      longitude: serviceData.longitude,
      distance: serviceData.distance,
    };

    standsService
      .getByGeo(payload)
      .then(onGetByGeoSuccess)
      .catch(onGetByGeoError);
  }, [standData.page]);

  return (
    <>
      <Container className="my-2">
        <Card className="mb-2 stand-list-card">
          <Card.Body>
            <Formik
              enableReinitialize={true}
              initialValues={geoFormValues}
              onSubmit={handleSubmit}
              validationSchema={standSchema}
            >
              <FormikForm>
                <Row
                  sm="auto"
                  as={Flex}
                  alignItems="center"
                  className="mb-2 pt-2 mb-sm-0 mx-auto"
                >
                  <Col xs="auto" className="px-1">
                    <Field
                      as="select"
                      name="distance"
                      type="text"
                      className="form-control stand-miles"
                    >
                      <option>Miles</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                    </Field>
                  </Col>
                  {isLoaded && (
                    <Autocomplete
                      className="address px-0"
                      options={autoCompleteConfig}
                      onLoad={onLoad}
                      onPlaceChanged={onPlaceChanged}
                    >
                      <Col xs="auto" className="px-1">
                        <Field
                          name="address"
                          type="text"
                          className="form-control"
                          placeholder="Address, City, or Zip"
                        />
                      </Col>
                    </Autocomplete>
                  )}
                  <Col xs="auto" className="px-1">
                    <Button type="submit" variant="primary">
                      Search
                    </Button>
                  </Col>
                  <ErrorMessage
                    className="finder-form-error"
                    name="distance"
                    component="div"
                  />
                  <ErrorMessage
                    className="finder-form-error"
                    name="address"
                    component="div"
                  />
                </Row>
              </FormikForm>
            </Formik>
          </Card.Body>
        </Card>
        <Card className="mb-3 stand-list-card">
          <Card.Body>
            <Row className="mb-1">
              <Col xs={6} className="col-label text-center">
                Address
              </Col>
              <Col className="col-label text-center" xs={3}>
                Status
              </Col>
              <Col className="col-label text-center" xs={3}>
                Actions
              </Col>
            </Row>
            <Row className="g-0">{standData.standComponents}</Row>
            <Card.Footer className="d-flex justify-content-center border-top pb-0">
              <Pagination
                onChange={onPageChange}
                current={standData.page}
                total={standData.totalCount}
                pageSize={standData.pageSize}
                locale={locale}
              />
            </Card.Footer>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default React.memo(StandsLocationFinder);
