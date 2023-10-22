import React from "react";
import Map from "react-map-gl";
import mapbox from "mapbox-gl";
const BaseMap = () => {
  if (!mapbox.supported())
    return <div className='container'>Sorry GL is not supported</div>;
  return (
    <Map
      style={{
        position: "absolute",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
      }}
      initialViewState={{
        bearing: 0,
        zoom: 19,
        latitude: 45.86575,
        longitude: 13.43268,
        pitch: 0,
      }}
      mapboxAccessToken='pk.eyJ1IjoiaWI5OCIsImEiOiJjbGhhbTRuaXUwOGliM2Ruc3h2YTFoMG9yIn0.YtRfHX0vI6aXB6WBD6hajg'
      mapStyle={`mapbox://styles/mapbox/light-v11`}
    ></Map>
  );
};

export default BaseMap;
