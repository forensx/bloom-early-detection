import React, { useState } from "react";
import "antd/dist/antd.css";
import { StaticMap } from "react-map-gl";
import DeckGL, { GeoJsonLayer } from "deck.gl";
import "./App.css";
import { Typography } from "antd";
import tempData from "./data/data.json";
import LocationReadout from "./components/LocationReadout";
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

const heatmapColorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
];

function App() {
  const [location, setLocation] = useState(null);

  const onClick = (info) => {
    if (info.object) {
      setLocation(info.object);
    }
  };

  const layers = [
    new GeoJsonLayer({
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
          return heatmapColorRange[0];
        } else if (
          f.properties.chloroAForecast > 1.6666666667 &&
          f.properties.chloroAForecast <= 3.3333333334
        ) {
          return heatmapColorRange[1];
        } else if (
          (f.properties.chloroAForecast > 3.3333333334) &
          (f.properties.chloroAForecast <= 5.0000000001)
        ) {
          return heatmapColorRange[2];
        } else if (
          (f.properties.chloroAForecast > 5.0000000001) &
          (f.properties.chloroAForecast <= 6.6666666668)
        ) {
          return heatmapColorRange[3];
        } else if (
          (f.properties.chloroAForecast > 6.6666666668) &
          (f.properties.chloroAForecast <= 8.3333333335)
        ) {
          return heatmapColorRange[4];
        } else if (
          (f.properties.chloroAForecast > 8.3333333335) &
          (f.properties.chloroAForecast <= 10)
        ) {
          return heatmapColorRange[5];
        }
      },
      // getFillColor: [255, 0, 0],
      // Interactive props
      pickable: true,
      autoHighlight: true,
      onClick,
    }),
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
          {heatmapColorRange.map((color) => (
            <div
              style={{
                width: "16.6667%",
                height: "18px",
                backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "6px",
          }}
        >
          <Text>No risk</Text>
          <Text>Risk of HAB</Text>
        </div>
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
