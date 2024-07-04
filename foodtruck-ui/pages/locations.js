import React, { useEffect, useState, useRef, useCallback } from "react";
import { Map, Pin, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import Image from "next/image";
import TruckIcon from "@/src/icons/test.svg";

export async function getStaticProps() {
  const res = await fetch(
    `${process.env.DATA_SERVER_HOST}${process.env.DATA_SERVER_URL}`
  );
  const repo = await res.json();
  const parseData = repo.map((truck) => ({
    id: truck.objectid,
    key: truck.applicant,
    location: {
      lat: parseFloat(truck.location.latitude),
      lng: parseFloat(truck.location.longitude),
    },
  }));
  return { props: { parseData } };
}

const ZOOM_MAP = 19;
const DEFAULT_LOCATION = { lat: 37.7749, lng: -122.4194 };
export default function Page({ parseData }) {
  const map = useMap();
  const clusterer = useRef(null);
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [data, setData] = useState([]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      console.log("Geolocation is supported");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log({ lat: latitude, lng: longitude });
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  const handleClick = useCallback((ev) => {
    if (!map) return;
    if (!ev.latLng) return;
    console.log("marker clicked:", ev.latLng.toString());
    map.panTo(ev.latLng);
  });

  const handleBounds = () => {
    const aNord = map.getBounds().getNorthEast().lat();
    const aEst = map.getBounds().getNorthEast().lng();
    const aSud = map.getBounds().getSouthWest().lat();
    const aWest = map.getBounds().getSouthWest().lng();
    const getLocs = parseData.filter(
      (truck) =>
        truck.location.lat < aNord &&
        truck.location.lat > aSud &&
        truck.location.lng < aEst &&
        truck.location.lng > aWest
    );
    setData(getLocs);
  };
  return (
    <div>
      <h1>Food truck App</h1>
      <span>SF edition</span>
      <button onClick={getUserLocation}>Get User Location</button>
      <div className="flex">
        <div className="w-1/4 h-screen bg-white">
          {data.map((loc) => (
            <div key={loc.id}>
              <span>{loc.key}</span>
            </div>
          ))}
        </div>
        <div className="w-full h-screen">
          <Map
            style={{ width: "100%", height: "100%" }}
            defaultCenter={DEFAULT_LOCATION}
            defaultZoom={ZOOM_MAP}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            mapId={process.env.MAP_ID}
            minZoom={5}
            maxZoom={20}
            onCameraChanged={handleBounds}
          />
          {data.map((poi) => (
            <AdvancedMarker
              key={poi.id}
              position={poi.location}
              clickable={true}
              onClick={handleClick}
            >
              <Image width={60} height={60} src={TruckIcon} />
              {/* <Pin
                background={"#FBBC04"}
                glyphColor={"#000"}
                borderColor={"#000"}
              /> */}
            </AdvancedMarker>
          ))}
        </div>
      </div>
    </div>
  );
}
