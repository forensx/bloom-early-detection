import React, { useState } from "react";
import { Typography } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Statistic, Row, Col, Button } from "antd";
import "../../node_modules/react-vis/dist/style.css";
import {
  XYPlot,
  LineSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  Hint,
  MarkSeries,
} from "react-vis";
const { Title, Text } = Typography;

function oneMonthChangeCalculation(oneMonthArray) {
  // calculate percentr change over one month of historic data
  // (final - initial)/initial * 100
  const chloroConcentrations = oneMonthArray.map((day) => day.y);
  const percentChange =
    ((chloroConcentrations.slice(-1)[0] - chloroConcentrations[0]) /
      chloroConcentrations[0]) *
    100;
  return percentChange;
}

function getLastChlorophyllConc(oneMonthArray) {
  // get last chloro value to present in side panel
  const chloroConcentrations = oneMonthArray.map((day) => day.y);
  const lastValue = chloroConcentrations.slice(-1)[0];
  return lastValue;
}

function makeTimeSeriesAxes(month_data) {
  let date_timeseries = [];
  let timeseries = month_data;
  for (let i = 0; i < timeseries.length; i++) {
    date_timeseries.push({ x: new Date(timeseries[i].x), y: timeseries[i].y });
  }
  return date_timeseries;
}

function LocationSpecific(props) {
  const [hoveredValue, setHoveredValue] = useState(null);
  const _forgetValue = () => {
    setHoveredValue(null);
  };
  const _rememberValue = (value) => {
    setHoveredValue(value);
  };

  const { location } = props;
  return (
    <div>
      <Title level={4}>{location.properties.name}</Title>
      <Text strong>
        {location.properties.ONE_MONTH[0].x} to{" "}
        {location.properties.ONE_MONTH.slice(-1)[0].x}
      </Text>
      <Row>
        <Col span={12}>
          {oneMonthChangeCalculation(location.properties.ONE_MONTH) >= 0 ? (
            <Statistic
              title="1 month Chloro-a Change:"
              value={oneMonthChangeCalculation(location.properties.ONE_MONTH)}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          ) : (
            <Statistic
              title="1 month Chloro-a Change:"
              value={oneMonthChangeCalculation(location.properties.ONE_MONTH)}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          )}
        </Col>
        <Col span={12}>
          <Statistic
            title="Current Chlorophyll Concentration"
            value={getLastChlorophyllConc(location.properties.ONE_MONTH)}
            precision={2}
            suffix="mg/ml"
          />
        </Col>
      </Row>
      <Row style={{ paddingTop: 3 }}>
        <Text strong style={{ paddingTop: 6 }}>
          {location.properties.ONE_FORECAST[0].x} to{" "}
          {location.properties.ONE_FORECAST.slice(-1)[0].x}
        </Text>
        <Col span={12}>
          <Statistic
            title="Chloro-a forecast (1 month)"
            value={location.properties.chloroAForecast}
            precision={2}
            suffix="mg/ml"
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Prediction interval (95% confidence)"
            value={location.properties.confidenceInterval[0].toFixed(2)}
            precision={2}
            suffix={
              "/" +
              location.properties.confidenceInterval[1].toFixed(2) +
              " mg/ml"
            }
          />
        </Col>
      </Row>
      <XYPlot
        xType="time"
        xPadding={30}
        yPadding={30}
        height={300}
        width={300}
        style={{ paddingTop: "12" }}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <Title title="Chlorophyll-a concentration (mg/m^3)" />
        <XAxis tickLabelAngle={-30} />
        <YAxis title="Chlorophyll-a concentration (mg/m^3)" />
        <LineSeries
          color={"#084AEE"}
          name={"Historic"}
          data={makeTimeSeriesAxes(location.properties.ONE_MONTH)}
        />
        <LineSeries
          color={"#08ACEE"}
          name={"Forecast"}
          data={makeTimeSeriesAxes(location.properties.ONE_FORECAST)}
        />
        <MarkSeries
          size={3}
          color={"#084AEE"}
          onValueMouseOver={_rememberValue}
          onValueMouseOut={_forgetValue}
          data={makeTimeSeriesAxes(location.properties.ONE_MONTH)}
        />
        <MarkSeries
          size={3}
          color={"#08ACEE"}
          onValueMouseOver={_rememberValue}
          onValueMouseOut={_forgetValue}
          data={makeTimeSeriesAxes(location.properties.ONE_FORECAST)}
        />
        {hoveredValue ? <Hint value={hoveredValue} /> : null}
      </XYPlot>
    </div>
  );
}

function LocationGeneral() {
  return (
    <div>
      <Title level={4}>United States</Title>
      <Row>
        <Col span={12}>
          <Statistic
            title="Percent of states with harmful algae blooms annually"
            value={50}
            suffix={"%"}
            prefix={">"}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Percent of waterbodies with excessive nutrient input"
            value={65}
            suffix={"%"}
            prefix={">"}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Statistic
            title="Annual health costs"
            value={900_000_000}
            precision={0}
            prefix={"$"}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Dead Zone surface area"
            value={245000}
            precision={0}
            suffix={"(sq. km.)"}
          />
        </Col>
      </Row>
    </div>
  );
}

export default function LocationReadout(props) {
  const { location } = props;
  return (
    <div>{location ? LocationSpecific({ location }) : LocationGeneral()}</div>
  );
}
