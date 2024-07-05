import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Map,
  AdvancedMarker,
  useMap,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import Image from "next/image";
import TruckIcon from "@/src/icons/food-pin.svg";
import GPSIcon from "@/src/icons/gps.svg";

const SF_BOUNDS = {
  north: 37.929811,
  south: 37.640314,
  west: -122.59307,
  east: -122.281479,
};

export async function getStaticProps() {
  const res = await fetch(
    `${process.env.DATA_SERVER_HOST}${process.env.DATA_SERVER_URL}`
  );
  const repo = await res.json();
  const parseData = repo
    .map((truck) => ({
      id: truck.objectid,
      key: truck.applicant,
      location: {
        lat: parseFloat(truck.location.latitude),
        lng: parseFloat(truck.location.longitude),
      },
    }))
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.key === value.key)
    );
  return { props: { parseData } };
}

const ZOOM_MAP = 19;
const DEFAULT_LOCATION = { lat: 37.7749, lng: -122.4194 };

export default function Page({ parseData }) {
  const map = useMap();
  const clusterer = useRef(null);
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [data, setData] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerRef, marker] = useAdvancedMarkerRef();

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
    console.log("marker clicked:", ev);
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

  const handleTruckDetail = (loc) => {
    map.panTo({ lat: loc.location.lat, lng: loc.location.lng });
  };
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <button
        onClick={getUserLocation}
        className="absolute z-10 w-12 h-12 bg-red-500 rounded-full bottom-2 right-2"
      >
        <Image src={GPSIcon} width={60} height={60} />
      </button>
      <div className="relative flex">
        <div className="absolute z-10 w-1/4 h-[calc(100%-24px)] card-header overflow-hidden bg-white rounded-t-3xl  top-4 left-4">
          <div className="flex flex-col items-center p-4 ">
            <h1 className="text-3xl">SanFran</h1>
            <h1 className="text-4xl">Eats</h1>
          </div>
          <div className="pb-4 overflow-y-auto h-[calc(100%-108px)]">
            {data.map((loc) => (
              <div
                key={loc.id}
                className="flex items-center justify-start p-4 border-b-2 border-gray-300 cursor-pointer"
                onClick={() => handleTruckDetail(loc)}
              >
                <span>{loc.key}</span>
              </div>
            ))}
          </div>
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
            maxZoom={19}
            onCameraChanged={handleBounds}
            restriction={{
              latLngBounds: SF_BOUNDS,
              strictBounds: true,
            }}
          />
          {data.map((poi) => (
            <AdvancedMarker
              ref={markerRef}
              key={poi.id}
              position={poi.location}
              clickable={true}
              onClick={handleClick}
              collisionBehavior="OPTIONAL_AND_HIDES_LOWER_PRIORITY"
            >
              <Image width={60} height={60} src={TruckIcon} alt={poi.key} />
            </AdvancedMarker>
          ))}
        </div>
      </div>
    </div>
  );
}
