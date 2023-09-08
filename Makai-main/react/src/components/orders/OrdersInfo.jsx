import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import debug from "sabio-debug";

const _logger = debug.extend("orders");

const OrdersInfo = () => {
  const location = useLocation();
  const [order, setOrderData] = useState({});

  useEffect(() => {
    const state = location.state;
    if (state && state.type === "ORDER_VIEW" && state.payload) {
      setOrderData((prevState) => {
        let stateOfOrders = { ...prevState, ...state.payload };
        return stateOfOrders;
      });
    }
  }, [location.state]);

  _logger("OrdersInfo location:", location);

  return (
    <React.Fragment>
      <Card
        className="bg-dark text-white light p-1 m-3 d-flex justify-content-center"
        style={{ maxWidth: "36rem" }}
      >
        <Card.Body className="d-flex flex-column justify-content-center">
          <Card style={{ width: "33rem" }}>
            <Card.Img src={order?.user?.avatarUrl} variant="top" />
            <Card.Header as="h1" className="text-center">
              {order?.user?.firstName} {order?.user?.mi} {order?.user?.lastName}
            </Card.Header>
            <Card.Body>
              <Card.Title as="h5" className="text-center">
                <strong>Rental Information:</strong>
              </Card.Title>
              <Card.Text className="text-muted text-center">
                Product Id: {order?.productId}
              </Card.Text>
              <Card.Text className="text-muted text-center">
                <strong>Order Status: </strong>
                {order?.orderStatus?.name}
              </Card.Text>
              <Card.Text className="text-muted text-center">
                {" "}
                Start: {new Date(order?.startTime).toLocaleDateString()}{" "}
                {new Date(order?.startTime).toLocaleTimeString()}
              </Card.Text>
              <Card.Text className="text-muted text-center">
                Estimated Stop:{" "}
                {new Date(order?.estimatedStop).toLocaleDateString()}{" "}
                {new Date(order?.estimatedStop).toLocaleTimeString()}
              </Card.Text>
              <Card.Text className="text-muted text-center">
                Actual Stop: {new Date(order?.actualStop).toLocaleDateString()}{" "}
                {new Date(order?.actualStop).toLocaleTimeString()}
              </Card.Text>
              <Link to="/orders">
                <Button>Back</Button>
              </Link>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default OrdersInfo;
