import "@/styles/globals.css";

import Navbar from '../components/Navbar';
import Provider from "./context/AuthContext";

function MyApp({ Component, pageProps }) {
  return (
    <>
     <Provider>

      <Navbar />
      <Component {...pageProps} />
     </Provider>
    </>
  );
}

export default MyApp;
