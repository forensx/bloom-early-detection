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

function LocationSpecific(props) {
  const data = [
    { x: 0, y: 8 },
    { x: 1, y: 5 },
    { x: 2, y: 4 },
    { x: 3, y: 9 },
    { x: 4, y: 1 },
    { x: 5, y: 7 },
    { x: 6, y: 6 },
    { x: 7, y: 3 },
    { x: 8, y: 2 },
    { x: 9, y: 0 },
  ];
  const { location } = props;
  console.log(location);
  return (
    <div>
      <Title level={4}>{location.properties.name}</Title>
      <Row>
        <Col span={12}>
          <Statistic
            title="1 month Chloro-a Change:"
            value={11.28}
            precision={2}
            valueStyle={{ color: "#3f8600" }}
            prefix={<ArrowUpOutlined />}
            suffix="%"
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Chloro-a forecast (1 month)"
            value={location.properties.chloroAForecast}
            precision={2}
            suffix="mg/ml"
          />
        </Col>
      </Row>
      <Row style={{ paddingTop: 6 }}>
        <Col span={12}>
          <Statistic title="Population affected" value={38942} precision={0} />
        </Col>
        <Col span={12}>
          <Statistic
            title="Prediction confidence"
            value={location.properties.confidenceInterval}
            precision={2}
            suffix="%"
          />
        </Col>
      </Row>
      <XYPlot height={300} width={300}>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <LineSeries data={data} />
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
            value={1_000_000_000}
            precision={0}
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
