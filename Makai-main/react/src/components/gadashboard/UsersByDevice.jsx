import ReactECharts from "echarts-for-react";
import React from "react";
import PropTypes from "prop-types";
function UsersByDevice(props) {
  const devicesData = props.devicesData;
  const option = {
    title: {
      text: "Views By Device",
    },
    tooltip: {
      trigger: "axis",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: devicesData.dates,
    },
    yAxis: {
      type: "value",
      position: "left",
      name: "views",
    },
    series: [
      {
        name: devicesData.devicesLable[0],
        type: "line",

        data: devicesData.valueA,
      },
      {
        name: devicesData.devicesLable[1],
        type: "line",

        data: devicesData.valueB,
      },
    ],
  };
  return <ReactECharts option={option} />;
}
UsersByDevice.propTypes = {
  devicesData: PropTypes.shape({
    dates: PropTypes.arrayOf(PropTypes.string),
    devicesLable: PropTypes.arrayOf(PropTypes.string),
    valueA: PropTypes.arrayOf(PropTypes.string),
    valueB: PropTypes.arrayOf(PropTypes.string),
  }),
};
export default UsersByDevice;
