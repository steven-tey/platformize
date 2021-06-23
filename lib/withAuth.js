import { useSession } from 'next-auth/client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const withAuth = WrappedComponent => {
  const RequiresAuth = pageProps => {

    if (pageProps.app) {
      const [ session ] = useSession()
      const router = useRouter()

      useEffect(() => {
          // if a there isn't a logged in user and session has finished loading
          // then redirect them to "/login"
          if(!session && typeof(session) != 'undefined') {
              router.push("/login")
          };
      }, [session]);

      // if there's a loggedInUser, show the wrapped page, otherwise show a loading indicator
      return <WrappedComponent {...pageProps} />;
    }
    return <WrappedComponent {...pageProps} />
  };

  return RequiresAuth;
};

export default withAuth;