import ReactECharts from "echarts-for-react";
import React from "react";
import PropTypes from "prop-types";
import debug from "sabio-debug";
const _logger = debug.extend("SbB");
function SessionByBrowser(props) {
  const browsersData = props.browsersData;
  _logger("SessionByBrowser", browsersData);
  const option = {
    tooltip: {
      trigger: "item",
    },
    title: {
      text: "Views by Browser",
    },
    legend: {
      bottom: "5%",
      left: "center",
    },
    series: [
      {
        name: "",
        type: "pie",
        radius: ["60%", "50%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "bottom",
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: Math.round(browsersData.chromeValues),
            name: browsersData.dimensions[0],
          },
          {
            value: Math.round(browsersData.safariValues),
            name: browsersData.dimensions[1],
          },
          {
            value: Math.round(browsersData.edgeValues),
            name: browsersData.dimensions[2],
          },
          {
            value: Math.round(browsersData.firefoxValues),
            name: browsersData.dimensions[3],
          },
        ],
      },
    ],
  };
  return <ReactECharts option={option} />;
}
SessionByBrowser.propTypes = {
  browsersData: PropTypes.shape({
    dimensions: PropTypes.arrayOf(PropTypes.string),
    chromeValues: PropTypes.number,
    safariValues: PropTypes.number,
    edgeValues: PropTypes.number,
    firefoxValues: PropTypes.number,
  }),
};
export default SessionByBrowser;
