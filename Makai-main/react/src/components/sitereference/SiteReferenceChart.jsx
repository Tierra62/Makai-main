import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import siteReferenceService from "services/siteReferenceService";
import debug from "sabio-debug";
import toastr from "toastr";

function SiteReferenceChart() {
  const [chartData, setChartData] = useState({});

  const _logger = debug.extend("chart");

  useEffect(() => {
    siteReferenceService
      .getChart()
      .then(onGetChartDataSuccess)
      .catch(onGetChartDataError);
  }, []);

  const onGetChartDataSuccess = (response) => {
    _logger("data", response);
    const responseArray = response.items;
    setChartData((prevState) => {
      const cd = { ...prevState };
      cd.seriesArray = responseArray.map((el) => el.totalCount);
      cd.nameArray = responseArray.map((el) => el.name);
      _logger("array", cd.nameArray);
      return cd;
    });
  };
  const onGetChartDataError = (error) => {
    _logger("error", error);
    toastr["error"]("There was a problem getting the data", "error");
  };

  const series = [
    {
      name: "Site Reference",
      data: chartData.seriesArray,
    },
  ];
  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    title: {
      text: "Site References",
      align: "center",
      margin: 50,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#263238",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: chartData.nameArray,
    },
    theme: {
      palette: "palette1",
    },
  };

  return (
    <React.Fragment>
      <div className="card">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        ></ReactApexChart>
      </div>
    </React.Fragment>
  );
}

export default SiteReferenceChart;
