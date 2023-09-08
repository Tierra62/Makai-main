import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { Marker } from "@react-google-maps/api";
const GOOGLE_AUTOCOMPLTE_APIKEY = process.env.REACT_APP_GOOGLE_AUTO_COMPLETE;

const containerStyle = {
  width: "400px",
  height: "400px",
};

const center = {
  lat: 38,
  lng: -104,
};

function Map() {
  return (
    <LoadScript googleMapsApiKey={GOOGLE_AUTOCOMPLTE_APIKEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={4}>
        <Marker
          visible={true}
          position={[
            { lat: 38, lng: -104 },
            { lat: 39, lng: -105 },
          ]}
        ></Marker>
        <></>
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(Map);
