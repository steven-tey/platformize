import AppLayout from '../../components/AppLayout'
import withAuth from '../../lib/withAuth'
import { getSession } from 'next-auth/client'

const Publication = ({session}) => {
    return (
        <>
            <AppLayout
                name={session.user?.name}
                email={session.user?.email}
            >
                <div>

                </div>
            </AppLayout>
        </>
    )
}

export async function getServerSideProps(ctx) {
  
    const { req, res } = ctx
    const subdomain = process.env.NODE_ENV === 'production'? req?.headers?.host?.split('.')[0] : process.env.CURR_SLUG
    if (subdomain == process.env.APP_SLUG) {
        const session = await getSession(ctx)
        return {
            props: {
                session: session
            }
        }
    } else {
        return {
            redirect: {
                destination: '/',
                statusCode: 302
            }
        }
    }
}

export default withAuth(Publication)