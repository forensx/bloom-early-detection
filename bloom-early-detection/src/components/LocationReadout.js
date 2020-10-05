import React from "react";
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

function LocationSpecific(props) {
  const { location } = props;
  // let date_timeseries = [];
  // let timeseries = location.properties.ONE_MONTH;
  // for (let i = 0; i < location.properties.ONE_MONTH.length; i++) {
  //   date_timeseries.push({ x: new Date(timeseries[i].x), y: timeseries[i].y });
  // }
  // location.properties.ONE_MONTH = date_timeseries;
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
        height={300}
        width={300}
        style={{ paddingTop: "12" }}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <LineSeries data={location.properties.ONE_MONTH} />
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
          <Statistic title="Affected Population" value={11012893} />
        </Col>
        <Col span={12}>
          <Statistic
            title="Money lost (annually)"
            value={900_000_000}
            precision={0}
            prefix={"$"}
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
