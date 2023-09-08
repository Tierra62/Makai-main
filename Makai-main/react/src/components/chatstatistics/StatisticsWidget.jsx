// @flow
import React from "react";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";
import debug from "sabio-debug";

const _logger = debug.extend("ChatStats");

const StatisticsWidget = ({ chartType, colors, data, strokeWidth }) => {
  //  default options
  const options = {
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "60%",
      },
    },
    xaxis: {
      crosshairs: {
        width: 1,
      },
    },
    stroke: {
      width: strokeWidth,
      curve: "smooth",
    },
    colors: colors,
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName) {
            _logger(seriesName);
            return "";
          },
        },
      },
      marker: {
        show: false,
      },
    },
  };

  // type
  const type = chartType;

  // chart data
  const series = [{ data: data || [] }];

  return (
    <>
      <Chart
        className="apex-charts"
        options={options}
        series={series}
        type={type}
        height={60}
      />
    </>
  );
};

StatisticsWidget.propTypes = {
  chartType: PropTypes.string.isRequired,
  colors: PropTypes.arrayOf("string").isRequired,
  data: PropTypes.arrayOf("number").isRequired,
  strokeWidth: PropTypes.number.isRequired,
};

export default StatisticsWidget;
