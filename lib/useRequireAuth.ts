import { useSession } from 'next-auth/client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import getConfig from 'next/config'

function useRequireAuth() {

  const {publicRuntimeConfig} = getConfig()
  const {APP_SLUG, NODE_ENV} = publicRuntimeConfig

  const [ session ] = useSession()

  const router = useRouter();
  // If auth.user is false that means we're not
  // logged in and should redirect.
  useEffect(() => {
    if(!session && typeof(session) != 'undefined') {
      if(NODE_ENV === 'production') {
        router.push(`/login`)
      } else {
        router.push(`/${APP_SLUG}/login`)
      }
    }
  }, [session, router]);

  return session;
}

export default useRequireAuth