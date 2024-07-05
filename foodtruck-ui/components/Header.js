export const Header = ({ data, handleTruckDetail }) => {
  const handleTruckDetailCallback = (loc) => {
    handleTruckDetail(loc);
  };
  return (
    <div className="absolute z-10 w-[calc(100%-16px)] md:w-1/4 md:h-[calc(100%-24px)] card-header overflow-hidden bg-white md:rounded-3xl rounded-xl top-2 md:top-4 left-2 md:left-4">
      <div className="flex flex-col items-center p-4 md:hidden">
        <h1 className="text-3xl">SF Eats</h1>
      </div>
      <div className="flex-col items-center hidden p-4 md:flex">
        <h1 className="text-3xl">SanFran</h1>
        <h1 className="text-5xl">Eats</h1>
      </div>
      <div className="md:block hidden pb-4 overflow-y-auto h-[calc(100%-108px)]">
        {data.length > 0 ? (
          data.map((loc) => (
            <div
              key={loc.id}
              className="flex items-center justify-start p-4 border-b-2 border-gray-300 cursor-pointer"
              onClick={() => handleTruckDetailCallback(loc)}
            >
              <span>{loc.key}</span>
            </div>
          ))
        ) : (
          <span className="block mt-8 text-xl text-center text-gray-500">
            No trucks found in this area
          </span>
        )}
      </div>
    </div>
  );
};
