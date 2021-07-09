import {useState, useEffect} from 'react'
import { AppProps } from 'next/app'
import '../styles/global.css';
import Router from "next/router";
import { Provider } from 'next-auth/client'
import LoadingBar from 'react-top-loading-bar'

const MyApp = ({ Component, pageProps }: AppProps) => {

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = () => {
      setProgress(25);
    };
    const end = () => {
      setProgress(100)
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
      <Provider 
        options={{
          clientMaxAge: 3600*24*7,
          keepAlive: 3600*24*7
        }}
        session={pageProps.session}
      >
        <LoadingBar
          color='#5046e4'
          height={5}
          transitionTime={100}
          waitingTime={500}
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default MyApp
