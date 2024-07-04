import "@/styles/globals.css";
import { APIProvider } from "@vis.gl/react-google-maps";

export default function App({ Component, pageProps }) {
  return (
    <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY}>
      <Component {...pageProps} />
    </APIProvider>
  );
}
