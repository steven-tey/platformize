import AppLayout from '../../../components/AppLayout'
import useRequireAuth from '../../../lib/useRequireAuth'
import { getSession } from 'next-auth/client'
import prisma from '../../../lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import Loader from '../../../components/Loader'

export default function PostSettings({rootUrl}){

    const session = useRequireAuth()
    if (!session) return <Loader/>

    return (
        <>
            <AppLayout
                name={session?.user?.name}
                email={session?.user?.email}
                image={session?.user?.image}
            >
            </AppLayout>
        </>
    )
}

export async function getServerSideProps(ctx) {

    const { id } = ctx.query;  
    const { req, res } = ctx
    const subdomain = process.env.NODE_ENV === 'production'? req?.headers?.host?.split('.')[0] : process.env.CURR_SLUG
    if (subdomain == process.env.APP_SLUG) {
        const session = await getSession(ctx)
        return {
            props: {
                session: session,
                rootUrl: process.env.ROOT_URL
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