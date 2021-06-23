import AppLayout from '../../components/AppLayout'
import withAuth from '../../lib/withAuth'
import { getSession } from 'next-auth/client'
import prisma from '../../lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import {
  ExternalLinkIcon,
  CogIcon,
  PlusIcon,
  ArrowLeftIcon
} from '@heroicons/react/outline'

const Publication = ({session, publication, posts, rootUrl}) => {
    const allPosts = JSON.parse(posts)
    return (
        <>
            <AppLayout
                name={session?.user?.name}
                email={session?.user?.email}
            >
                <div className="w-7/12 mx-auto grid grid-cols-5 gap-10 divide-x">
                    <div className="pt-10 col-span-1">
                        <Link href='/'>
                            <a className="text-left font-semibold text-lg">
                                ← All Publications 
                            </a>
                        </Link>
                        <div className="relative mx-auto mt-5 mb-3 w-16 h-auto rounded-xl overflow-hidden">
                            <Image 
                                width={80}
                                height={80}
                                src='/logo.svg'
                            />
                        </div>
                        <p className="text-center font-medium">{publication.name}</p>

                        <div className="text-left grid grid-cols-1 gap-6 mt-10">
                            <Link href={`/publication/${publication.id}/`}>
                                <a className="font-semibold text-gray-900 bg-gray-300 rounded-md w-full px-2 py-2 text-lg">
                                    Posts
                                </a>
                            </Link>
                            <Link href={`/publication/${publication.id}/drafts`}>
                                <a className="font-semibold text-gray-900 hover:bg-gray-300 rounded-md w-full px-2 py-2 text-lg">
                                    Drafts
                                </a>
                            </Link>
                            <Link href={`/publication/${publication.id}/settings`}>
                                <a className="font-semibold text-gray-900 hover:bg-gray-300 rounded-md w-full px-2 py-2 text-lg">
                                    Settings
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className="pt-16 pl-10 col-span-4">
                        <div className="flex justify-between">
                        <h1 className="font-bold text-3xl m-5 mb-10">
                            My Posts
                        </h1>
                        <button className="bg-gray-900 px-5 h-12 mt-5 rounded-3xl text-lg text-white hover:bg-gray-700">
                            New Post
                            <PlusIcon
                                className="h-5 w-5 inline-block ml-2"
                            />
                        </button>
                        </div>
                        {allPosts.map((post) => (
                            <div className="sm:px-5 sm:flex sm:space-x-10 py-5 mb-10 h-250 bg-gray-200 rounded-lg cursor-pointer">                    
                                <div className="relative space-y-5">
                                    <CogIcon
                                    className="h-10 w-10 hover:bg-gray-400 p-2 rounded-full absolute right-0 top-0 mr-3 mt-3"
                                    />
                                    <p className="text-3xl font-semibold text-gray-900">{post.title}</p>
                                    <p className="mt-3 text-lg text-gray-600 truncate pr-10">{post.description}</p>
                                    <a href={`https://${post.publicationUrl}.${rootUrl}/p/${post.slug}`} target="_blank" className="absolute bg-gray-900 py-3 px-8 rounded-3xl text-lg text-white hover:bg-gray-700">
                                        {post.publicationUrl}.{rootUrl}/p/{post.slug}
                                        <ExternalLinkIcon
                                            className="h-5 w-5 inline-block ml-2"
                                        />
                                    </a>
                                </div>
                            </div>
                        ))}
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
        const posts = await prisma.post.findMany({
            where: {
                Publication: {
                    id: id
                }
            }
        })
        const publication = await prisma.publication.findUnique({
            where: {
                id: id
            }
        }) 
        return {
            props: {
                session: session,
                publication: publication,
                posts: JSON.stringify(posts),
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

export default withAuth(Publication)