import Image from "next/image";
import GPSIcon from "@/src/icons/gps.svg";

export const GeoLocationButton = ({ map }) => {
  const getUserLocation = () => {
    if (navigator.geolocation) {
      console.log("Geolocation is supported");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  return (
    <button
      onClick={getUserLocation}
      className="absolute z-10 flex items-center justify-center w-12 h-12 bg-white rounded-full bottom-8 right-8 geo-btn"
    >
      <Image src={GPSIcon} width={25} />
    </button>
  );
};
