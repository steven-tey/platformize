import { useSession } from 'next-auth/client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

function useRequireAuth() {

  const [ session ] = useSession()

  const router = useRouter();
  // If auth.user is false that means we're not
  // logged in and should redirect.
  useEffect(() => {
    if(!session && typeof(session) != 'undefined') {
      router.push(`/login`)
    }
  }, [session, router]);

  return session;
}

export default useRequireAuth