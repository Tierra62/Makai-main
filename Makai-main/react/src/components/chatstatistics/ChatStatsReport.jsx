import React, { useEffect, useState, useRef } from "react";
import { Button, Col, Row, Table, Card, CardGroup } from "react-bootstrap";
import PropTypes from "prop-types";
import videoChatService from "services/videoChatService";
import Pagination from "rc-pagination";
import locale from "rc-pagination/lib/locale/en_US";
import debug from "sabio-debug";
import LineChartMeetings from "./LineChartMeetings";
import ReactToPrint from "react-to-print";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { BiTimer } from "react-icons/bi";
import StatisticsWidget from "./StatisticsWidget";
import "rc-pagination/assets/index.css";
import "../chatstatistics/chatstats.css";

const _logger = debug.extend("ChatStats");

function ChatStatsReport({ currentUser, chosenStats }) {
  const [statsData, setStatsData] = useState({
    stats: null,
    allMeetings: null,
    pageData: { pageIndex: 0, pageSize: 7, totalCount: 0 },
  });
  const [cardOption, setCardOption] = useState({ days: 7, option: "meetings" });

  useEffect(() => {
    if (chosenStats === "user") {
      videoChatService
        .getStatsByCreator(
          currentUser.id,
          statsData.pageData.pageIndex,
          statsData.pageData.pageSize
        )
        .then(onMeetingsSuccess);
      videoChatService
        .getStatsByDayHost(cardOption.days)
        .then(onStatsSuccess)
        .catch(onStatsFailed);
      videoChatService
        .getStatsByDayHost(0)
        .then(onAllStatsSuccess)
        .catch(onStatsFailed);
    }

    if (chosenStats === "all") {
      videoChatService
        .getAllStats(statsData.pageData.pageIndex, statsData.pageData.pageSize)
        .then(onMeetingsSuccess);
      videoChatService
        .getStatsDaily(cardOption.days)
        .then(onStatsSuccess)
        .catch(onStatsFailed);
      videoChatService
        .getStatsDaily(0)
        .then(onAllStatsSuccess)
        .catch(onStatsFailed);
    }
  }, [statsData.pageData.pageIndex, cardOption.days, chosenStats]);

  const onStatsFailed = (error) => {
    _logger("Couldnt get data because: ", error);
  };

  const onAllStatsSuccess = (response) => {
    setStatsData((prevState) => {
      const newState = { ...prevState };
      newState.allTimeStats = {};
      newState.allTimeStats.allTimesInitialDates = response.items.map(
        (e) => e.date
      );
      newState.allTimeStats.allTimesInitialTotalMeets = response.items.map(
        (e) => e.totalMeetings
      );
      newState.allTimeStats.allTimesInitialTotalDuration = response.items.map(
        (e) => e.totalDuration
      );
      newState.allTimeStats.allTimesInitialTotalParticipants =
        response.items.map((e) => e.totalParticipants);
      newState.allTimeStats.allTimesTotalMeets =
        newState.allTimeStats?.allTimesInitialTotalMeets?.reduce(sumUp);
      newState.allTimeStats.allTimesTotalDuration =
        Math.round(
          newState.allTimeStats?.allTimesInitialTotalDuration?.reduce(sumUp) /
            60
        ) || 0;
      newState.allTimeStats.allTimesTotalParticipants =
        newState.allTimeStats?.allTimesInitialTotalParticipants?.reduce(sumUp);
      return newState;
    });
  };

  const onStatsSuccess = (response) => {
    setStatsData((prevState) => {
      const newState = { ...prevState };
      newState.stats = {};
      newState.ss = response.items.map((e) => e.date);

      newState.stats.allDates = response.items.map((e) => e.date);
      newState.stats.allTotalMeets = response.items.map((e) => e.totalMeetings);
      newState.stats.allTotalDuration = response.items.map(
        (e) => e.totalDuration
      );
      newState.stats.allTotalParticipants = response.items.map(
        (e) => e.totalParticipants
      );
      newState.stats.totalMeets = newState.stats.allTotalMeets?.reduce(sumUp);
      newState.stats.totalDuration =
        Math.round(newState.stats.allTotalDuration?.reduce(sumUp) / 60) || 0;
      newState.stats.totalParticipants =
        newState.stats.allTotalParticipants?.reduce(sumUp);
      return newState;
    });
  };

  const sumUp = (a, b) => {
    return a + b;
  };

  const onMeetingsSuccess = (response) => {
    setStatsData((prevState) => {
      const newState = { ...prevState };
      newState.pageData.totalCount = Number(response.item.totalCount);
      newState.allMeetings = response.item.pagedItems;
      newState.meetingsTableComponents = newState.allMeetings.map(mapMeetings);
      return newState;
    });
  };

  /* No using formik as not onSubmit needed and
     onChange behavior needed to be overwritten */
  const onChangeHandler = (e) => {
    if (e.target.value === "1") {
      setCardOption((prev) => {
        const nw = { ...prev };
        nw.days = 7;
        return nw;
      });
    }
    if (e.target.value === "2") {
      setCardOption((prev) => {
        const nw = { ...prev };
        nw.days = 15;
        return nw;
      });
    }
    if (e.target.value === "3") {
      setCardOption((prev) => {
        const nw = { ...prev };
        nw.days = 30;
        return nw;
      });
    }
  };

  const mapMeetings = (meeting, index) => {
    const date = new Date(meeting.startTime);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const minutes = (meeting.duration / 60).toFixed(1);
    const minutesArray = minutes.split(".");
    return (
      <tr key={`meeting_key_${index}`} className="chatstats-tr">
        <td>{index + 1}</td>
        <td>{meeting.roomName}</td>
        <td>{meeting.participants?.length || 0}</td>
        <td>{month + "/" + day + "/" + year}</td>
        <td>{minutesArray[0] + " min " + minutesArray[1] + " sec"}</td>
      </tr>
    );
  };

  const onChange = (page) => {
    setStatsData((prevData) => {
      const pd = { ...prevData };
      pd.pageData.pageIndex = page - 1;
      return pd;
    });
  };

  const handleClickCard = (e) => {
    const cardName = e.currentTarget.id;
    setCardOption((prev) => {
      const newState = { ...prev };
      newState.option = cardName;
      return newState;
    });
  };

  /* to print */
  const componentRef = useRef();

  const reactToPrintTrigger = React.useCallback(() => {
    return <Button className="mt-3 chatstats-print">Print a Report</Button>;
  }, []);

  return (
    <>
      <div ref={componentRef}>
        <Row sm={3}>
          <Col>
            <p className="text-black">
              <b>Here are the statistics for </b>
            </p>
          </Col>
          <Col className="chatstats-col-unique">
            <select
              className="form-select chatstats-select"
              onChange={onChangeHandler}
            >
              <option value="1">The last 7 Days</option>
              <option value="2">The last 15 Days</option>
              <option value="3">The last 30 Days</option>
            </select>
          </Col>
        </Row>
        <CardGroup className="text-center">
          <Card
            className={`${
              cardOption.option === "meetings"
                ? "chatstats-card chatstats-selected chatstats-card-middle"
                : "chatstats-card chatstats-card-middle"
            }`}
            onClick={handleClickCard}
            id="meetings"
          >
            <Card.Header className="chatstats-card-header">
              <AiOutlineVideoCameraAdd className="chatstats-icons" />
              <h5 className="chatstats-card-title">
                Total <br /> Meetings
              </h5>
            </Card.Header>
            <Card.Body>
              <p className="chatstats-card-body">
                {statsData.stats?.totalMeets}
              </p>
            </Card.Body>
          </Card>
          <Card
            onClick={handleClickCard}
            id="participants"
            className={`${
              cardOption.option === "participants"
                ? "chatstats-card chatstats-selected chatstats-card-middle"
                : "chatstats-card chatstats-card-middle"
            }`}
          >
            <Card.Header className="chatstats-card-header">
              <BsPeople className="chatstats-icons" />
              <h5 className="chatstats-card-title">Total Participants</h5>
              <p className="chatstats-card-subtitle">
                in the last {cardOption.days} days
              </p>
            </Card.Header>
            <Card.Body>
              <p className="chatstats-card-body">
                {statsData.stats?.totalParticipants}
              </p>
            </Card.Body>
          </Card>
          <Card
            className={`${
              cardOption.option === "minutes"
                ? "chatstats-card chatstats-selected"
                : "chatstats-card"
            }`}
            onClick={handleClickCard}
            id="minutes"
          >
            <Card.Header className="chatstats-card-header">
              <BiTimer className="chatstats-icons" />
              <h5 className="chatstats-card-title">Total Minutes</h5>
              <p className="chatstats-card-subtitle">
                spent in the last {cardOption.days} days
              </p>
            </Card.Header>
            <Card.Body>
              <p className="chatstats-card-body">
                {statsData.stats?.totalDuration}
              </p>
            </Card.Body>
          </Card>
        </CardGroup>
        <Row>
          <LineChartMeetings
            numberDays={cardOption.days}
            statistics={statsData}
            optionSelected={cardOption.option}
          />
        </Row>
        <Row>
          <h1 className="chatstats-alltime-title text-center mt-3 mb-3">
            Statistics For All Time
          </h1>
          <CardGroup className="text-center mb-4">
            <Card className="chatstats-card chatstats-alltimes">
              <Card.Header className="chatstats-card-header">
                <AiOutlineVideoCameraAdd className="chatstats-icons" />
                <h5 className="chatstats-card-title">Total Meetings</h5>
                <p className="chatstats-card-subtitle">All Time</p>
              </Card.Header>
              <Card.Body className="text-center">
                <p className="chatstats-card-body">
                  {statsData?.allTimeStats?.allTimesTotalMeets}
                </p>
                <div className="col-11 mt-4">
                  <StatisticsWidget
                    chartType="line"
                    colors={["#40afbb"]}
                    data={statsData?.allTimeStats?.allTimesInitialTotalMeets}
                    strokeWidth={2}
                  />
                </div>
              </Card.Body>
            </Card>
            <Card className="chatstats-card chatstats-alltimes">
              <Card.Header className="chatstats-card-header">
                <BsPeople className="chatstats-icons" />
                <h5 className="chatstats-card-title">Total Participants</h5>
                <p className="chatstats-card-subtitle">All Time</p>
              </Card.Header>
              <Card.Body className="text-center">
                <p className="chatstats-card-body">
                  {statsData?.allTimeStats?.allTimesTotalParticipants}
                </p>
                <div className="col-11 mt-4">
                  <StatisticsWidget
                    chartType="line"
                    colors={["#40afbb"]}
                    data={
                      statsData?.allTimeStats?.allTimesInitialTotalParticipants
                    }
                    strokeWidth={2}
                  />
                </div>
              </Card.Body>
            </Card>
            <Card className="chatstats-card chatstats-alltimes">
              <Card.Header className="chatstats-card-header">
                <BiTimer className="chatstats-icons" />
                <h5 className="chatstats-card-title">Total Minutes</h5>
                <p className="chatstats-card-subtitle">All Time</p>
              </Card.Header>
              <Card.Body className="text-center">
                <p className="chatstats-card-body">
                  {statsData?.allTimeStats?.allTimesTotalDuration}
                </p>
                <div className="col-11 mt-4">
                  <StatisticsWidget
                    chartType="bar"
                    colors={["#40afbb"]}
                    data={statsData?.allTimeStats?.allTimesInitialTotalDuration}
                    strokeWidth={2}
                  />
                </div>
              </Card.Body>
            </Card>
          </CardGroup>
        </Row>
        <Row className="mt-4">
          <Col>
            <p className="chatstats-details-title">All Meeting Details</p>
            <div className="text-center">
              <Table bordered className="chatstats-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Room Name</th>
                    <th>Participants</th>
                    <th>Date</th>
                    <th>Duration (min) </th>
                  </tr>
                </thead>
                <tbody>{statsData?.meetingsTableComponents}</tbody>
              </Table>
              <Pagination
                onChange={onChange}
                pageSize={statsData.pageData.pageSize}
                current={statsData.pageData.pageIndex + 1}
                total={statsData.pageData?.totalCount}
                locale={locale}
              />
            </div>
          </Col>
        </Row>
      </div>
      <Row>
        <Col className="text-center">
          <ReactToPrint
            content={() => componentRef.current}
            documentTitle="Report Chat Statistics"
            trigger={reactToPrintTrigger}
            pageStyle="style"
          />
        </Col>
      </Row>
    </>
  );
}
ChatStatsReport.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  chosenStats: PropTypes.string.isRequired,
};

export default ChatStatsReport;
