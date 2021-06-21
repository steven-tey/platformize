import {useState, useEffect} from 'react'
import { AppProps } from 'next/app'
import '../styles/global.css';
import Router from "next/router";

const MyApp = ({ Component, pageProps }: AppProps) => {

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);
  return (
    <>
    {loading ? (
        <h1>Loading...</h1>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  )
}

export default MyApp
