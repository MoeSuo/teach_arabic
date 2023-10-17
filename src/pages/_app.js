import "@/styles/globals.css";

import Navbar from '../components/Navbar';
import Provider from "./context/AuthContext";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
  return (
    <>
     <Provider>
     <ToastContainer />
      <Navbar />
      <Component {...pageProps} />
     </Provider>
    </>
  );
}

export default MyApp;
