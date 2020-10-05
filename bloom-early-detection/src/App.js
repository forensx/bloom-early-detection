import React, { useState } from "react";
import "antd/dist/antd.css";
import "./App.css";
import { StaticMap } from "react-map-gl";
import DeckGL, { GeoJsonLayer, HeatmapLayer } from "deck.gl";
import { Typography } from "antd";
import tempData from "./data/data.json";
import chlorData from "./data/heatmap_data.json";
import LocationReadout from "./components/LocationReadout";
import { Select, Radio } from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

const MAPBOX_TOKEN =
  "pk.eyJ1IjoicGFudDIwMDIiLCJhIjoiY2prenlwb2ZtMHlnMjNxbW1ld3VxYWZ4cCJ9.rOb8DhCzsysBIw69MxyWKg"; // eslint-disable-line

const AIR_PORTS =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson";

const INITIAL_VIEW_STATE = {
  latitude: 44.652382,
  longitude: -83.902433,
  zoom: 6,
  bearing: 0,
  pitch: 30,
};

const pinsColorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
];

const heatmapColorRange = [
  // [255, 255, 178],
  [254, 217, 118],
  [254, 178, 76],
  [253, 141, 60],
  [240, 59, 32],
  [189, 0, 38],
];

function App() {
  const [vizType, setVizType] = useState("pins");
  const [location, setLocation] = useState(null);

  const onClick = (info) => {
    if (info.object) {
      setLocation(info.object);
    }
  };

  const onChange = (e) => {
    setVizType(e.target.value);
  };

  const layers = [
    chlorData && vizType === "heatmap"
      ? new HeatmapLayer({
          data: chlorData,
          colorRange: heatmapColorRange,
          id: "heatmp-chlor",
          pickable: true,
          getPosition: (d) => [d[1], d[0]],
          getWeight: (d) => d[2],
          radiusPixels: 25,
          intensity: 1,
          threshold: 0.05,
        })
      : vizType === "pins"
      ? new GeoJsonLayer({
          id: "tempData",
          data: tempData,
          // Styles
          filled: true,
          pointRadiusMinPixels: 2,
          pointRadiusScale: 2000,
          getRadius: (f) => 5,
          /// [0, 2], (2, 4], (4, 6], (6, 8], (8, 10]
          getFillColor: (f) => {
            if (f.properties.chloroAForecast <= 1.6666666667) {
              return pinsColorRange[0];
            } else if (
              f.properties.chloroAForecast > 1.6666666667 &&
              f.properties.chloroAForecast <= 3.3333333334
            ) {
              return pinsColorRange[1];
            } else if (
              (f.properties.chloroAForecast > 3.3333333334) &
              (f.properties.chloroAForecast <= 5.0000000001)
            ) {
              return pinsColorRange[2];
            } else if (
              (f.properties.chloroAForecast > 5.0000000001) &
              (f.properties.chloroAForecast <= 6.6666666668)
            ) {
              return pinsColorRange[3];
            } else if (
              (f.properties.chloroAForecast > 6.6666666668) &
              (f.properties.chloroAForecast <= 8.3333333335)
            ) {
              return pinsColorRange[4];
            } else if (
              (f.properties.chloroAForecast > 8.3333333335) &
              (f.properties.chloroAForecast <= 10)
            ) {
              return pinsColorRange[5];
            }
          },
          // Interactive props
          pickable: true,
          autoHighlight: true,
          onClick,
        })
      : null,
  ];

  return (
    <div
      className="container"
      style={{ height: "100vh", width: "100vw", padding: 0, margin: 0 }}
    >
      <div
        style={{
          backgroundColor: "white",
          zIndex: "1000",
          position: "absolute",
          marginTop: "1.0%",
          left: "1.5%",
          display: "flex",
          flexDirection: "column",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "12px",
          paddingBottom: "12px",
        }}
      >
        <Radio.Group onChange={onChange} value={vizType}>
          <Radio value={"pins"}>Pins</Radio>
          <Radio value={"heatmap"}>Cholorophyll-a Heatmap</Radio>
        </Radio.Group>
      </div>
      <div
        style={{
          backgroundColor: "white",
          zIndex: "1000",
          position: "absolute",
          marginTop: "1.0%",
          right: "1.5%",
          display: "flex",
          flexDirection: "column",
          width: "360px",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "12px",
          paddingBottom: "12px",
        }}
      >
        <Title level={3}>Bloom Early Detection</Title>
        <Text>An investigation in bloom early prediction.</Text>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            paddingTop: "16px",
          }}
        >
          {vizType === "pins"
            ? pinsColorRange.map((color) => (
                <div
                  style={{
                    width: "16.6667%",
                    height: "18px",
                    backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                  }}
                />
              ))
            : heatmapColorRange.map((color) => (
                <div
                  style={{
                    width: "20%",
                    height: "18px",
                    backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                  }}
                />
              ))}
        </div>
        {vizType === "pins" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "2px",
            }}
          >
            <Text type="secondary">No risk</Text>
            <Text type="secondary">Risk of HAB</Text>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "2px",
            }}
          >
            <Text type="secondary">Low concentration</Text>
            <Text type="secondary">High concentration</Text>
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: 12,
            marginBottom: 6,
          }}
        >
          <LocationReadout location={location} />
        </div>
      </div>
      <div
        style={{
          zIndex: "-1",
        }}
      >
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={layers}
        >
          <StaticMap
            mapboxApiAccessToken={MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/satellite-v9"
          />
        </DeckGL>
      </div>
    </div>
  );
}

export default App;
