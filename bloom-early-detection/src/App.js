import React from "react";
import "antd/dist/antd.css";
import { StaticMap } from "react-map-gl";
import DeckGL, { GeoJsonLayer, ArcLayer } from "deck.gl";
import "./App.css";
import { Typography } from "antd";
const { Title, Text } = Typography;

const MAPBOX_TOKEN =
  "pk.eyJ1IjoicGFudDIwMDIiLCJhIjoiY2prenlwb2ZtMHlnMjNxbW1ld3VxYWZ4cCJ9.rOb8DhCzsysBIw69MxyWKg"; // eslint-disable-line

const AIR_PORTS =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson";

const INITIAL_VIEW_STATE = {
  latitude: 51.47,
  longitude: 0.45,
  zoom: 4,
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
  const onClick = (info) => {
    if (info.object) {
      // eslint-disable-next-line
      alert(
        `${info.object.properties.name} (${info.object.properties.abbrev})`
      );
    }
  };

  const layers = [
    new GeoJsonLayer({
      id: "airports",
      data: AIR_PORTS,
      // Styles
      filled: true,
      pointRadiusMinPixels: 2,
      pointRadiusScale: 2000,
      getRadius: (f) => 11 - f.properties.scalerank,
      getFillColor: [200, 0, 80, 180],
      // Interactive props
      pickable: true,
      autoHighlight: true,
      onClick,
    }),
    new ArcLayer({
      id: "arcs",
      data: AIR_PORTS,
      dataTransform: (d) =>
        d.features.filter((f) => f.properties.scalerank < 4),
      // Styles
      getSourcePosition: (f) => [-0.4531566, 51.4709959], // London
      getTargetPosition: (f) => f.geometry.coordinates,
      getSourceColor: [0, 128, 200],
      getTargetColor: [200, 0, 80],
      getWidth: 1,
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
          height: "380px",
          width: "340px",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "12px",
        }}
      >
        <Title level={4}>Bloom Early Detection</Title>
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
            mapStyle="mapbox://styles/mapbox/dark-v9"
          />
        </DeckGL>
      </div>
    </div>
  );
}

export default App;
