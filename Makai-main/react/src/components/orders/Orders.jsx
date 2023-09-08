import React, { useEffect, useState } from "react";
import * as orderService from "../../services/orderService";
import OrderCard from "./OrderCard";
import debug from "sabio-debug";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { Row, Col } from "react-bootstrap";

const _logger = debug.extend("orders");

const Orders = () => {
  const [orderData, setOrderData] = useState({
    orderArray: [],
    orderComponents: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
  });

  useEffect(() => {
    orderService
      .getAllOrders(orderData.page - 1, orderData.pageSize)
      .then(onGetOrderSuccess)
      .catch(onGetOrderError);
  }, [orderData.page]);

  const onGetOrderSuccess = (data) => {
    _logger(data);
    let newOrderArr = data.item.pagedItems;
    const totalCount = data.item.totalCount;

    setOrderData((prevState) => {
      const orderData = { ...prevState };
      orderData.orderArray = newOrderArr.map(mapOrder);
      orderData.totalCount = totalCount;
      return orderData;
    });
  };

  const onGetOrderError = (error) => {
    _logger(error, "order error");
  };

  const mapOrder = (order) => {
    return (
      <Col key={order.id} xs={12} sm={6} md={4} lg={3}>
        <OrderCard order={order} />
      </Col>
    );
  };

  const onChange = (page) => {
    setOrderData((prevState) => {
      const orderData = { ...prevState };
      orderData.page = page;
      return orderData;
    });
  };

  return (
    <React.Fragment>
      <div className="container p-2 m-4 d-flex justify-content-center">
        <div className="row p-2">
          <div className="col p-4 m-4">
            <Pagination
              className="mt-3 mb-3"
              onChange={onChange}
              current={orderData.page}
              total={orderData.totalCount}
              pageSize={orderData.pageSize}
            />
            <Row>{orderData.orderArray}</Row>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default React.memo(Orders);
