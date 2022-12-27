import React from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import config from "../config";
import GoogleMapReact from "google-map-react";
import "./MarkerStyle.css";
import stationList from "../static/station.json";

const Marker = ({ text, color }) => {
  return (
    <div
      className="markerstyle"
      style={{ backgroundColor: color, cursor: "pointer" }}
      title={text}
    ></div>
  );
};
const GoogleMap = () => {
  const defaultProps = {
    center: {
      lat: 21.1855856,
      lng: 79.1175765,
    },
    zoom: 13,
  };
  const renderMarker = () => {
    const MarkerUi = [];

    stationList.stations.map((item) => {
      MarkerUi.push(
        <Marker lat={item.lat} lng={item.lng} text={item.name} color="blue" />
      );
    });
    return MarkerUi;
  };

  const renderMarkers = (map, maps) => {
    let marker = new maps.Marker({
    position: { lat: 21.1855856, lng: 79.1175765 },
    map,
    title: 'Hello World!'
    });
    return marker;
   };

   return(
  <div style={{ height: "60vh", margin: 10 }} className="card-body">
  <iframe
  src="https://www.google.com/maps/d/viewer?mid=1Abjh72BYbNo2snTpBhWCWTtzLtEvbhly&ll=21.103957657393206%2C79.07195250000001&z=12"
  
  ></iframe>
  </div>
);
 
};

export default GoogleMap;
