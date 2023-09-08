import React, { useState, useEffect } from "react";
import { Spinner } from "reactstrap";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import { useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "90%",
  height: "80%",
  padding: "5%",
  margin: "5%",
};

const defaultCenter = {
  lat: 33.5397354,
  lng: -117.7816925,
};

const _logger = debug.extend("standsForm:Map");
const MY_API_KEY = process.env.REACT_APP_GOOGLE_AUTO_COMPLETE;

function StandsMap({ locations, locationId, isFormSubmitted }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: MY_API_KEY,
    libraries: ["places"],
  });

  const [locCenter, setLocCenter] = useState(defaultCenter);

  const computeCenter = (locObjs) => {
    let center = { lat: 0, lng: 0 };
    let length = locObjs.length;
    for (let i = 0; i < locObjs.length; i++) {
      const element = locObjs[i];
      center.lat += element.lat;
      center.lng += element.lng;
    }

    center.lat = center.lat / length;
    center.lng = center.lng / length;

    return center;
  };

  useEffect(() => {
    if (locationId !== null && locations) {
      setLocCenter(() => {
        let center = defaultCenter;
        for (let i = 0; i < locations.length; i++) {
          const element = locations[i];
          if (Number(element.id) === Number(locationId)) {
            center = { lat: element.lat, lng: element.lng };
            return center;
          }
        }
      });
    } else if (locations) {
      setLocCenter(() => {
        return computeCenter(locations);
      });
    }
    _logger("center", locCenter);
  }, [locationId]);

  useEffect(() => {
    setLocCenter(defaultCenter);
  }, [isFormSubmitted, isLoaded]);

  const markerMapper = (loc) => {
    let marker = new google.maps.Marker({
      position: { lat: loc.lat, lng: loc.lng },
      map,
      title: "Click to zoom",
    });
    marker.addListener("click", () => {
      window.setTimeout(() => {
        map.setZoom(15);
        map.setCenter(marker.getPosition());
      }, 500);
    });

    return marker;
  };

  let map = null;
  if (isLoaded && locations) {
    map = new google.maps.Map(document.getElementById("mapContainer"), {
      zoom: 10,
      center: locCenter,
      mapContainerStyle: containerStyle,
    });
    locations.map(markerMapper);
  }

  useEffect(() => {
    if (locCenter !== defaultCenter && isLoaded) {
      window.setTimeout(() => {
        map.panTo(locCenter);
      }, 1000);
    }
  }, [locCenter]);

  return isLoaded && locations ? <></> : <Spinner />;
}

StandsMap.propTypes = {
  isFormSubmitted: PropTypes.bool,
  locationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      lat: PropTypes.number,
      lng: PropTypes.number,
    })
  ),
};

export default React.memo(StandsMap);
