import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Container, Table } from "react-bootstrap";
import Flex from "components/common/Flex";
import PageHeader from "components/common/PageHeader";
import corner2 from "../../assets/img/illustrations/corner-2.png";
import Background from "components/common/Background";
import { MdHotelClass, MdOutlineSurfing } from "react-icons/md";
import { BsPersonFillCheck } from "react-icons/bs";
import { formatDate } from "../../utils/dateFormater";
import ReactEChartsCore from "echarts-for-react/lib/core";
import { PieChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { getColor } from "helpers/utils";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import * as loyaltyPointsService from "../../services/loyaltyPointsService";
import * as loyaltyPointsSourceService from "../../services/loyaltyPointsSourceService";
import LoyaltyPointsTotal from "./LoyaltyPointsTotal";
import toastr from "toastr";
import "toastr/build/toastr.css";
import debug from "sabio-debug";

const _logger = debug.extend("Loy");

const LoyaltyPointsDashboard = () => {
  const [pointsData, setPointsData] = useState({
    pointsList: [],
    pointsComponents: [],
  });

  const [current, setCurrent] = useState({
    pageIndex: 1,
    pageSize: 10,
    pageTotal: 0,
  });

  const [totalValues, setTotalValues] = useState({
    totalLifeTimePoints: 0,
    totalPointsRedeemed: 0,
    totalPointsAvailable: 0,
  });

  useEffect(() => {
    loyaltyPointsService
      .getByUserIdRunningTotals()
      .then(onGetByUserIdRunningTotalsSuccess)
      .catch(onGetByUserIdRunningTotalsError);
  }, []);

  useEffect(() => {
    loyaltyPointsService
      .getbyUserId(current.pageIndex - 1, current.pageSize)
      .then(onGetByUserIdSuccess)
      .catch(onGetByUserIdError);
  }, [current.pageIndex, current.pageSize]);

  const onGetByUserIdRunningTotalsSuccess = (response) => {
    _logger("success onGetByUserIdRunningTotal", response);
    let totalResponse = response.item;
    setTotalValues((prev) => {
      const totalValues = { ...prev };
      totalValues.totalLifeTimePoints = totalResponse.totalLifeTimePoints;
      totalValues.totalPointsRedeemed = totalResponse.totalPointsRedeemed;
      totalValues.totalPointsAvailable = totalResponse.totalPointsAvailable;
      return totalValues;
    });
  };
  const onGetByUserIdRunningTotalsError = (error) => {
    toastr.error("Could not gather running totals for the user...", `${error}`);
    _logger("failed onGetByUserIdRunningTotal", error);
  };

  const onGetByUserIdSuccess = (response) => {
    _logger("success onGetByUserId pagination", response);
    let pageResponse = response.item;
    setCurrent((prevState) => {
      const pageFromResponse = { ...prevState };
      pageFromResponse.pageTotal = pageResponse.totalCount;
      return pageFromResponse;
    });
    let arrayOfResponse = response.item.pagedItems;

    _logger(arrayOfResponse);

    setPointsData((prevState) => {
      const pointsData = { ...prevState };
      pointsData.pointsList = arrayOfResponse;
      pointsData.pointsComponents = arrayOfResponse.map(mapTable);
      return pointsData;
    });
  };

  const mapTable = (loyaltyPoint) => {
    loyaltyPointsSourceService
      .isExpired(loyaltyPoint.loyaltyPointSource.id)
      .then(onExpireSuccess)
      .catch(onExpireError);
    return (
      <LoyaltyPointsTotal
        loyaltyPoint={loyaltyPoint}
        key={`List ${loyaltyPoint.id}`}
      />
    );
  };

  const onExpireSuccess = (response) => {
    _logger(
      "success scanning and updating expiration date if needed",
      response
    );
  };

  const onExpireError = (error) => {
    _logger("error update expire source", error);
  };

  const onGetByUserIdError = (error) => {
    toastr.error("Could not retrieve data from the user...", `${error}`);
    _logger("failed onGetByUserId pagination", error);
  };

  const onChange = (page) => {
    _logger("onChange", page);
    setCurrent((prevState) => {
      const newIndex = { ...prevState };
      newIndex.pageIndex = page;
      return newIndex;
    });
  };

  echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    PieChart,
    CanvasRenderer,
    LegendComponent,
  ]);

  const getOptions = () => ({
    tooltip: {
      trigger: "item",
      padding: [7, 10],
      backgroundColor: getColor("gray-100"),
      borderColor: getColor("gray-300"),
      textStyle: { color: getColor("dark") },
      borderWidth: 1,
      transitionDuration: 0,
      axisPointer: {
        type: "none",
      },
    },

    legend: {
      left: "left",
      textStyle: {
        color: getColor("gray-600"),
      },
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "80%"],
        center: ["50%", "60%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderWidth: 2,
          borderColor: getColor("gray-100"),
        },
        label: {
          show: false,
          position: "center",
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          scale: false,
        },
        data: [
          {
            value:
              totalValues.totalLifeTimePoints +
              totalValues.totalPointsRedeemed -
              totalValues.totalPointsAvailable,
            name: "Expired/Deleted",
            itemStyle: {
              color: getColor("danger"),
            },
          },
          {
            value: totalValues.totalPointsAvailable,
            name: "Available",
            itemStyle: {
              color: getColor("primary"),
            },
          },
          {
            value: -totalValues.totalPointsRedeemed,
            name: "Redeemed",
            itemStyle: {
              color: getColor("warning"),
            },
          },
        ],
      },
    ],
  });

  const todayDate = new Date();
  const formattedDate2 = formatDate(todayDate.toISOString());

  return (
    <>
      <Container fluid>
        <div className="mx-auto my-5">
          <div className="mb-3">
            <PageHeader
              title="Earn Points & Save Money"
              description="Each year the Loyalty Points tracker begins on March 1 and goes through the last day of the following February. 
                                        For example, qualification for 2023 begins on Wed, Mar 1, 2023 and ends on Thur, Feb 29, 2024. 
                                        Your Loyalty Point balance will reset to zero on Fri, Mar 1, 2024."
              className="mb-3 bg-soft-secondary"
            >
              <Row className="g-3 m-3">
                <Col md={4} lg={4} xl={4} xxl={4}>
                  <Card className="h-100 border-5 border-xl">
                    <Card.Body>
                      <Row className="flex-between-center g-0">
                        <Col className="d-lg-block flex-between-center text-center">
                          <h5 className="text-black">Daily</h5>
                          <h3 className="text-black">Login</h3>
                        </Col>

                        <BsPersonFillCheck className="z-index-1" size={50} />
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} lg={4} xl={4} xxl={4}>
                  <Card className="h-100 border-5 border-xl">
                    <Card.Body>
                      <Row className="flex-between-center g-0">
                        <Col className="d-lg-block flex-between-center text-center">
                          <h5 className="text-black">Spend $ on</h5>
                          <h3 className="text-black">Rentals</h3>
                        </Col>
                        <MdOutlineSurfing className="z-index-1" size={50} />
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} lg={4} xl={4} xxl={4}>
                  <Card className="h-100 border-5 border-xl">
                    <Card.Body>
                      <Row className="flex-between-center g-0">
                        <Col className="d-lg-block flex-between-center text-center">
                          <h5 className="text-black">Redeem</h5>
                          <h3 className="text-black">Rewards</h3>
                        </Col>
                        <MdHotelClass className="z-index-1" size={50} />
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
                <div className="text-center mt-4">
                  <div className="badge-soft-secondary text-1100">
                    Points Value
                  </div>
                  <div>10pts = $0.10</div>
                  <div>100pts = $1.00</div>
                  <div>1,000pts = $10.00</div>
                  <div>10,000pts = $100.00</div>
                </div>
              </Row>

              <Button
                href="/products"
                target="_blank"
                variant="link"
                size="sm"
                className="ps-0"
              >
                Shop Now
              </Button>
            </PageHeader>
            <h2 className="text-white mt-5">DASHBOARD</h2>
          </div>
        </div>
        <Card className="mb-3">
          <h2 className="mt-3 mx-3">
            {" "}
            Balance as of <strong>{formattedDate2}</strong>
          </h2>
          <Row className="g-3 mb-3 mx-2 p-2">
            <Card s={2} style={{ width: "18rem" }}>
              <ReactEChartsCore
                echarts={echarts}
                option={getOptions()}
                style={{ height: 300 }}
              />
            </Card>
            <Col s={9} className="mx-2">
              <Card className="">
                <Background image={corner2} />
                <Card.Body>
                  <Row className="flex-between-center g-0">
                    <Col xs={6} className="d-lg-block flex-between-center">
                      <h5 className="mb-2 text-black">
                        {" "}
                        Total Lifetime Points{" "}
                      </h5>
                      <h1 className="mt-1 mb-1 text-700 text fw-normal lh-1">
                        {totalValues.totalLifeTimePoints}
                      </h1>
                    </Col>
                    <Col xs="auto" className="h-100"></Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card className="">
                <Background image={corner2} />
                <Card.Body>
                  <Row className="flex-between-center g-0">
                    <Col xs={6} className="d-lg-block flex-between-center">
                      <h5 className="mb-2 text-black">Total Points Redeemed</h5>
                      <h1 className="mb-1 text-700 fw-normal lh-1">
                        {totalValues.totalPointsRedeemed}
                      </h1>
                    </Col>
                    <Col xs="auto" className="h-100"></Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card className="">
                <Background image={corner2} />
                <Card.Body>
                  <Row className="flex-between-center g-0">
                    <Col xs={6} className="d-lg-block flex-between-center">
                      <h5 className="mb-2 text-black">
                        Total Points Available{" "}
                      </h5>
                      <h1 className="mb-1 text-700 fw-normal lh-1">
                        {totalValues.totalPointsAvailable}
                      </h1>
                    </Col>
                    <Col xs="auto" className="h-100"></Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card>

        <Card>
          <Card.Body>
            <Flex justifyContent="space-between" alignItems="end">
              <Col>
                <Pagination
                  className="mt-3 mb-3"
                  onChange={onChange}
                  current={current.pageIndex}
                  total={current.pageTotal}
                  pageSize={current.pageSize}
                  locale={locale}
                />
              </Col>
            </Flex>
            <div className="table-responsive">
              <Table className="table table-bordered table-hover">
                <thead className="table-primary">
                  <tr>
                    <th className="border-0">Loyalty Point Name</th>
                    <th className="border-0">Points</th>
                    <th className="border-0">Claim Date</th>
                    <th className="border-0">Expiration Date</th>
                    <th className="border-0">Status</th>
                  </tr>
                </thead>
                <tbody>{pointsData.pointsComponents}</tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default LoyaltyPointsDashboard;
