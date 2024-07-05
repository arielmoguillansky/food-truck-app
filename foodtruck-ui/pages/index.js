import React, { useEffect, useState, useRef, useCallback } from "react";
import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import Image from "next/image";
import TruckIcon from "@/src/icons/food-pin.svg";
import { Header } from "@/components/Header";
import { ModalCard } from "@/components/ModalCard";
import { GeoLocationButton } from "@/components/GeoLocationButton";
import { DEFAULT_LOCATION, SF_BOUNDS, ZOOM_MAP } from "@/helpers/constants";

const serverHost = process.env.NEXT_PUBLIC_DATA_SERVER_HOST;
const serverUrl = process.env.NEXT_PUBLIC_DATA_SERVER_URL;
const fullServerUrl = `${serverHost}${serverUrl}`;
export async function getStaticProps() {
  console.log(fullServerUrl);
  const res = await fetch(fullServerUrl);
  const repo = await res.json();
  const parseData = repo
    .map((truck) => ({
      id: truck.objectid,
      key: truck.applicant,
      location: {
        lat: parseFloat(truck.location.latitude),
        lng: parseFloat(truck.location.longitude),
      },
      fooditems: truck.fooditems ? truck.fooditems.split(":") : null,
      facilitytype: truck.facilitytype || null,
    }))
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.key === value.key)
    );
  return { props: { parseData } };
}

export default function Page({ parseData }) {
  const map = useMap();
  const clusterer = useRef(null);
  const [data, setData] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  const handleClick = useCallback((ev, poi) => {
    if (!map) return;
    if (!ev.latLng) return;
    setSelectedMarker(null);
    setTimeout(() => {
      setSelectedMarker(poi);
    }, 300);
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
    setSelectedMarker(null);
    setTimeout(() => {
      setSelectedMarker(loc);
    }, 300);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setSelectedMarker(null);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <GeoLocationButton map={map} />
      <div className="relative flex">
        <Header data={data} handleTruckDetail={handleTruckDetail} />
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
              key={poi.id}
              position={poi.location}
              clickable={true}
              onClick={(ev) => handleClick(ev, poi)}
              zIndex={selectedMarker?.id === poi.id ? 10 : 0}
            >
              <ModalCard
                selectedMarker={selectedMarker}
                poi={poi}
                handleClose={handleClose}
              />
              <Image width={60} height={60} src={TruckIcon} alt={poi.key} />
            </AdvancedMarker>
          ))}
        </div>
      </div>
    </div>
  );
}
