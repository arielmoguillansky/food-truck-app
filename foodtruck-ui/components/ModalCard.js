import CrossIcon from "@/src/icons/cross.svg";
import Image from "next/image";

export const ModalCard = ({ selectedMarker, poi, handleClose }) => {
  const handleCloseCallback = (event) => {
    handleClose(event);
  };
  return (
    selectedMarker?.id === poi.id && (
      <div
        className={`absolute cursor-default p-6 md:w-[500px] w-64 h-auto rounded-xl bg-white detail-card md:left-16 -left-16 -top-36 md:-top-20 ${
          selectedMarker ? "active" : ""
        }`}
      >
        <button
          onClick={(event) => handleCloseCallback(event)}
          className="absolute cursor-pointer right-8"
        >
          <Image width={20} height={20} src={CrossIcon} alt={"Close icon"} />
        </button>
        <span className="text-base font-bold md:text-xl">
          {selectedMarker.key}
        </span>
        <p className="text-gray-500 md:text-base text-md">
          {selectedMarker.facilitytype}
        </p>
        {selectedMarker.fooditems && (
          <ul className="flex flex-wrap gap-2 mt-4">
            {selectedMarker.fooditems.map((item) => (
              <li className="capitalize md:text-base text-md">{item}</li>
            ))}
          </ul>
        )}
      </div>
    )
  );
};
