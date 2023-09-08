import React from "react";
import ReactECharts from "echarts-for-react";
import PropTypes from "prop-types";
function DeviceTracking(props) {
  const viewsData = props.viewsData;
  const options = {
    title: {
      text: "Total Views",
    },
    grid: {},
    xAxis: {
      type: "category",
      data: viewsData.dimensions,
    },
    yAxis: {
      type: "value",
      position: "left",
      name: "views",
    },
    series: [
      {
        data: viewsData.metrics,
        type: "line",
        smooth: true,
      },
    ],
    tooltip: {
      trigger: "axis",
    },
  };
  return <ReactECharts option={options} />;
}
DeviceTracking.propTypes = {
  viewsData: PropTypes.shape({
    dimensions: PropTypes.arrayOf(PropTypes.string),
    metrics: PropTypes.arrayOf(PropTypes.string),
  }),
};
export default DeviceTracking;
