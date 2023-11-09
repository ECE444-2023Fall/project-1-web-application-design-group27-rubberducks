import React from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "60vh",
};

const Map = ({ lat, lng }) => {
  const center = {
    lat: lat,
    lng: lng,
  };

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={17}
        center={center}
      >
        <MarkerF position={center} />
      </GoogleMap>
    </div>
  );
};

export default Map;
