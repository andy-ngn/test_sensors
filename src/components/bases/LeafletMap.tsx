import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const LeafletMap = () => {
  return (
    <div className='flex relative justify-center items-center w-full border h-screen flex-col'>
      sas
      <MapContainer
        style={{
          height: "30%",
          width: "100%",
        }}
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
