import React, { useEffect, useState } from "react";
import {
  getTotalViews,
  getBrowsers,
  getDevices,
} from "services/googleanalyticsreport/googelAnalyticsReportService";
import PageVisits from "./PageVisits";
import SessionByBrowser from "./SessionByBrowser";
import UsersByDevice from "./UsersByDevice";
import debug from "sabio-debug";
import { formatDate } from "../../utils/dateFormater";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Field, Formik, Form } from "formik";
import "./gadashboard.css";
const _logger = debug.extend("GARD");
function GoogleReportsDashboard() {
  const today = new Date(Date.now());
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [startDate, setStartDate] = useState({
    startDate: sevenDaysAgo.toISOString().substring(0, 10),
  });
  const [endDate, setEndDate] = useState({
    endDate: today.toISOString().substring(0, 10),
  });
  const [views] = useState({
    startDate: sevenDaysAgo.toISOString().substring(0, 10),
    endDate: today.toISOString().substring(0, 10),
    metrics: [{ expression: "ga:pageviews" }],
    dimensions: [{ name: "ga:date" }],
  });
  const [browsers] = useState({
    startDate: sevenDaysAgo.toISOString().substring(0, 10),
    endDate: today.toISOString().substring(0, 10),
    metrics: [{ expression: "ga:pageviews" }],
    dimensions: [{ name: "ga:date" }, { name: "ga:browser" }],
  });
  const [devices] = useState({
    startDate: sevenDaysAgo.toISOString().substring(0, 10),
    endDate: today.toISOString().substring(0, 10),
    metrics: [{ expression: "ga:pageviews" }],
    dimensions: [{ name: "ga:date" }, { name: "ga:deviceCategory" }],
  });
  const [viewsData, setViewsData] = useState({
    dimensions: [],
    metrics: [],
  });
  const [browsersData, setBrowsersData] = useState({
    dimensions: [],
    metrics: [],
    chromeValues: 0,
    safariValues: 0,
    edgeValues: 0,
    firefoxValues: 0,
  });
  const [devicesData, setDeviceData] = useState({
    dates: [],
    devicesLable: [],
    valueA: [],
    valueB: [],
  });
  useEffect(() => {
    if (startDate.startDate === sevenDaysAgo && endDate.endDate === today) {
      getTotalViews(views)
        .then(onGetTotalViewsSuccess)
        .catch(onGetTotalViewsError);
      getBrowsers(browsers)
        .then(onGetBrowsersSuccess)
        .catch(onGetBrowsersError);
      getDevices(devices).then(onGetDevicesSuccess).catch(onGetDevicesError);
    } else {
      views.startDate = startDate.startDate;
      views.endDate = endDate.endDate;
      getTotalViews(views)
        .then(onGetTotalViewsSuccess)
        .catch(onGetTotalViewsError);
      browsers.startDate = startDate.startDate;
      browsers.endDate = endDate.endDate;
      getBrowsers(browsers)
        .then(onGetBrowsersSuccess)
        .catch(onGetBrowsersError);
      devices.startDate = startDate.startDate;
      devices.endDate = endDate.endDate;
      getDevices(devices).then(onGetDevicesSuccess).catch(onGetDevicesError);
    }
  }, [startDate, endDate]);
  const onGetTotalViewsSuccess = (response) => {
    setViewsData((prevState) => {
      const newState = { ...prevState };
      const report = response.data.item.reports[0].data.rows;
      newState.dimensions = report.map((dimension) => {
        const year = dimension.dimensions[0].slice(0, 4);
        const month = dimension.dimensions[0].slice(4, 6);
        const day = dimension.dimensions[0].slice(6, 8);
        const date = `${year}-${month}-${day}`;
        return formatDate(date).slice(4);
      });
      newState.metrics = report.map((metric) => {
        return metric.metrics[0].values[0];
      });
      return newState;
    });
  };
  const onGetTotalViewsError = (error) => {
    _logger("GA Report error", error);
  };
  const onGetBrowsersSuccess = (response) => {
    const report = response.data.item.reports[0].data.rows;
    const totals = parseInt(
      response.data.item.reports[0].data.totals[0].values[0]
    );
    _logger("GAReport", response);
    _logger("totals", totals);
    setBrowsersData((prevState) => {
      const newState = { ...prevState };
      const browserNames = report.map((browser) => {
        return browser.dimensions[1];
      });
      newState.dimensions = [...new Set(browserNames)];
      newState.chromeValues =
        (report
          .map((item) => {
            if (item.dimensions[1] === newState.dimensions[0]) {
              return parseInt(item.metrics[0].values[0]);
            }
          })
          .filter((item) => {
            return item !== undefined;
          })
          .reduce((a, c) => a + c, 0) /
          totals) *
        100;
      newState.safariValues =
        (report
          .map((item) => {
            if (item.dimensions[1] === newState.dimensions[1]) {
              return parseInt(item.metrics[0].values[0]);
            }
          })
          .filter((item) => item !== undefined)
          .reduce((a, c) => a + c, 0) /
          totals) *
        100;
      newState.edgeValues =
        (report
          .map((item) => {
            if (item.dimensions[1] === newState.dimensions[2]) {
              return parseInt(item.metrics[0].values[0]);
            }
          })
          .filter((item) => item !== undefined)
          .reduce((a, c) => a + c, 0) /
          totals) *
        100;
      newState.firefoxValues =
        (report
          .map((item) => {
            if (item.dimensions[1] === newState.dimensions[3]) {
              return parseInt(item.metrics[0].values[0]);
            }
          })
          .filter((item) => item !== undefined)
          .reduce((a, c) => a + c, 0) /
          totals) *
        100;
      return newState;
    });
  };
  const onGetBrowsersError = (error) => {
    _logger("browser error", error);
  };
  const onGetDevicesSuccess = (response) => {
    const report = response.data.item.reports[0].data.rows;
    setDeviceData((prevState) => {
      const newData = { ...prevState };
      const dateArray = report.map((item) => {
        const year = item.dimensions[0].slice(0, 4);
        const month = item.dimensions[0].slice(4, 6);
        const day = item.dimensions[0].slice(6, 8);
        const date = `${year}-${month}-${day}`;
        return formatDate(date).slice(4);
      });
      newData.dates = [...new Set(dateArray)];
      const deviceArray = report.map((item) => {
        return item.dimensions[1];
      });
      newData.devicesLable = [...new Set(deviceArray)];
      newData.valueA = report.map((item) => {
        if (item.dimensions[1] === newData.devicesLable[0]) {
          return item.metrics[0].values[0];
        }
      });
      newData.valueA = newData.valueA.filter((item) => {
        return item !== undefined;
      });
      newData.valueB = report.map((item) => {
        if (item.dimensions[1] === newData.devicesLable[1]) {
          return item.metrics[0].values[0];
        }
      });
      newData.valueB = newData.valueB.filter((item) => {
        return item !== undefined;
      });
      return newData;
    });
  };
  const onGetDevicesError = (error) => {
    _logger("devices error", error);
  };
  const onSelectDate = (values) => {
    _logger("VALUES", values);
    if (values.target.name === "startDate") {
      setStartDate((prevState) => {
        const newStart = { ...prevState };
        newStart.startDate = values.target.value;
        return newStart;
      });
    }
    if (values.target.name === "endDate") {
      setEndDate((prevState) => {
        const newEnd = { ...prevState };
        newEnd.endDate = values.target.value;
        return newEnd;
      });
    }
  };
  return (
    <React.Fragment>
      <Card className=" my-4 main-GAD-background-body">
        <Card.Header className="text-center">
          <h1 className="GAD-header">Google Analytics Dashboard</h1>
        </Card.Header>
      </Card>
      <Card className="pb-3 main-GAD-background-body">
        <Container>
          <Row className="justify-content-end">
            <Col className="col-lg-6">
              <Card className="mt-3">
                <Card.Body>
                  <Formik
                    enableReinitialize={true}
                    initialValues={(startDate, endDate)}
                  >
                    <Form className="justify-content-end">
                      <Row>
                        <Col className="text-end">
                          <label className="me-2">Start Date</label>
                          <Field
                            id="startDate"
                            name="startDate"
                            type="date"
                            value={startDate.startDate}
                            onChange={onSelectDate}
                          ></Field>
                        </Col>
                        <Col>
                          <label className="me-2">End Date</label>
                          <Field
                            id="endDate"
                            name="endDate"
                            type="date"
                            value={endDate.endDate}
                            onChange={onSelectDate}
                          ></Field>
                        </Col>
                      </Row>
                    </Form>
                  </Formik>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        <Container className="mt-3">
          <Col>
            <Card className="mb-3">
              <Card.Body>
                <PageVisits viewsData={viewsData} />
              </Card.Body>
            </Card>
          </Col>
          <Row>
            <Col>
              <Card>
                <Card.Body className="col">
                  <UsersByDevice devicesData={devicesData} />
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Body className="col">
                  <SessionByBrowser browsersData={browsersData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
}
export default GoogleReportsDashboard;
