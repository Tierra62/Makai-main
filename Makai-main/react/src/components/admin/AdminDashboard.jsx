import React, { useEffect, useState } from "react";
import { Card, Container, Row } from "react-bootstrap";
import Partners from "components/partneradmin/Partners";
import WeatherDisplay from "components/weather/WeatherDisplay";
import PropTypes from "prop-types";
import userService from "services/userService";
import debug from "sabio-debug";
import "./admindashboard.css";

const _logger = debug.extend("AdminDashboard");

const AdminDashboard = (props) => {
  const [currAdmin, setCurrAdmin] = useState({});

  useEffect(() => {
    userService
      .getById(props.currentUser.id)
      .then(onGetUserSuccess)
      .catch(onGetUserError);
  }, []);

  const onGetUserSuccess = (response) => {
    setCurrAdmin(response);
  };

  const onGetUserError = (err) => {
    _logger("couldnt get the user info because: ", err);
  };

  return (
    <>
      <Container className="admin-dashboard-container">
        <div>
          <img
            src="https://images.pexels.com/photos/2249606/pexels-photo-2249606.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            className="admin-dashboard-imageheader"
          />
        </div>
        <Card className="admin-dashboard-card no-border">
          <img
            src={currAdmin.item?.avatarUrl}
            className="admin-dashboard-profilepic"
          />
          <div className="admin-dashboard-textwrapper">
            <h3 className="admin-dashboard-title text-white">
              Welcome {currAdmin.item?.firstName}
            </h3>
            <p className="text-white">Your Admin Dashboard</p>
          </div>
          <Card.Body className="mt-5 text-center">
            <Row>
              <WeatherDisplay />
            </Row>
            <Row className="mt-5 mb-2">
              <Partners myView={false} />
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

AdminDashboard.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default AdminDashboard;
