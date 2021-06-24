import AppLayout from '../../../components/AppLayout'
import withAuth from '../../../lib/withAuth'
import { getSession } from 'next-auth/client'
import prisma from '../../../lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

function stopPropagation(e) {
    e.stopPropagation();
}

const Settings = ({session, publication, rootUrl}) => {

    return (
        <>
            <AppLayout
                name={session?.user?.name}
                email={session?.user?.email}
                image={session?.user?.image}
            >
                <div className="w-7/12 mx-auto grid grid-cols-4 gap-10 h-screen divide-x">
                    <div className="pt-10 col-span-1">
                        <Link href='/'>
                            <a className="text-left font-semibold text-lg">
                                ← All Publications 
                            </a>
                        </Link>
                        <a href={`https://${publication.url}.${rootUrl}`} target="_blank">
                            <div className="relative mx-auto mt-5 mb-3 w-16 h-auto rounded-xl overflow-hidden">
                                <Image 
                                    width={80}
                                    height={80}
                                    src='/logo.svg'
                                />
                            </div>
                            <p className="text-center font-medium">{publication.name}</p>
                        </a>

                        <div className="text-left grid grid-cols-1 gap-6 mt-10">
                            <Link href={`/publication/${publication.id}/`}>
                                <a className="font-semibold text-gray-900 hover:bg-gray-300 rounded-md w-full px-2 py-2 text-lg">
                                    Posts
                                </a>
                            </Link>
                            <Link href={`/publication/${publication.id}/drafts`}>
                                <a className="font-semibold text-gray-900 hover:bg-gray-300 rounded-md w-full px-2 py-2 text-lg">
                                    Drafts
                                </a>
                            </Link>
                            <Link href={`/publication/${publication.id}/settings`}>
                                <a className="font-semibold text-gray-900 bg-gray-300 rounded-md w-full px-2 py-2 text-lg">
                                    Settings
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className="pt-16 pl-10 col-span-3">
                        <div className="flex justify-between">
                        <h1 className="font-bold text-3xl m-5 mb-10">
                            Settings
                        </h1>
                        </div>
                    </div>
                </div>
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
        const publication = await prisma.publication.findUnique({
            where: {
                id: id
            }
        }) 
        return {
            props: {
                session: session,
                publication: publication,
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

export default withAuth(Settings)