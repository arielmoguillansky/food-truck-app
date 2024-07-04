import { APIProvider, Map } from "@vis.gl/react-google-maps";
export async function getStaticProps() {
  const res = await fetch(
    `${process.env.DATA_SERVER_HOST}${process.env.DATA_SERVER_URL}`
  );
  const repo = await res.json();
  return { props: { repo } };
}

export default function Page({ repo }) {
  console.log(process.env.GOOGLE_MAPS_API_KEY);
  return (
    <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY}>
      <Map
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={3}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      />
    </APIProvider>
  );
}
