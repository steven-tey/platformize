import {useState, useEffect} from 'react'
import { AppProps } from 'next/app'
import '../styles/global.css';
import Router from "next/router";
import { Provider } from 'next-auth/client'
import Loader from '../components/Loader'

const MyApp = ({ Component, pageProps }: AppProps) => {

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      //if (Router.pathname == 'publication')
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
        <Loader/>
      ) : (
        <Provider 
          options={{
            clientMaxAge: 3600*24*7,
            keepAlive: 3600*24*7
          }}
          session={pageProps.session}
        >
          <Component {...pageProps} />
        </Provider>
      )}
    </>
  )
}

export default MyApp
