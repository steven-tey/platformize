import AppLayout from '../../components/AppLayout'
import withAuth from '../../lib/withAuth'
import { getSession } from 'next-auth/client'
import prisma from '../../lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
  ExternalLinkIcon,
  DotsHorizontalIcon,
  PlusIcon,
} from '@heroicons/react/outline'

function stopPropagation(e) {
    e.stopPropagation();
}

const setPublishStatus = async (postId, publish) => {
    await fetch(`/api/set-publish-status?postId=${postId}&publishStatus=${publish}`, {
        method: 'POST',
    })
    window.location.reload();
}

const Publication = ({session, publication, posts, rootUrl}) => {
    const allPosts = JSON.parse(posts)
    return (
        <>
            <AppLayout
                name={session?.user?.name}
                email={session?.user?.email}
            >
                <div className="w-7/12 mx-auto grid grid-cols-4 gap-10 h-screen divide-x">
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
                    <div className="pt-16 pl-10 col-span-3">
                        <div className="flex justify-between">
                        <h1 className="font-bold text-3xl m-5 mb-10">
                            My Posts
                        </h1>
                        <button className="bg-gray-900 px-5 h-12 mt-5 rounded-3xl text-lg text-white hover:bg-gray-700 focus:outline-none">
                            New Post
                            <PlusIcon
                                className="h-5 w-5 inline-block ml-2"
                            />
                        </button>
                        </div>
                        {allPosts.map((post) => (
                            <Link href={`/post/${post.id}`}>
                                <div className="p-8 mb-3 pr-20 flex justify-between bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer">                    
                                    <div className="relative space-y-5">
                                        <p className="text-2xl font-semibold text-gray-900">{post.title}</p>
                                        <p className="mt-3 text-lg text-gray-600">
                                            <time dateTime={post.createdAt}>
                                                {`${Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(post.createdAt))} ${Intl.DateTimeFormat('en', { day: '2-digit' }).format(new Date(post.createdAt))} at ${Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' }).format(new Date(post.createdAt))}`}
                                            </time>
                                        </p>
                                    </div>
                                    <div>
                                        <a onClick={stopPropagation} href={`https://${post.publicationUrl}.${rootUrl}/p/${post.slug}`} target="_blank">
                                            <ExternalLinkIcon
                                                className="h-10 w-10 inline-block mr-6 my-6 p-2"
                                            />
                                        </a>
                                        <Menu onClick={stopPropagation} as="div" className="absolute inline-block my-6">
                                            <div>
                                            <Menu.Button className="focus:outline-none">
                                                <DotsHorizontalIcon
                                                    className="h-10 w-10 p-2"
                                                />
                                            </Menu.Button>
                                            </div>
                                            <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                            >
                                            <Menu.Items className="absolute z-20 right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-300 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="px-1 py-1 ">
                                                    <Menu.Item>
                                                        <Link href={`/post/${post.id}`}>
                                                            <a className='text-gray-900 hover:bg-gray-300 group flex rounded-md items-center w-full px-2 py-2 text-sm'>
                                                                Edit post
                                                            </a>
                                                        </Link>
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={(e)=> e.stopPropagation()}
                                                                className={`${
                                                                active ? 'bg-gray-300' : null
                                                                } group flex text-gray-900 focus:outline-none rounded-md items-center w-full px-2 py-2 text-sm`}
                                                            >
                                                                {post.pinnedPost.length > 0 ? "Unpin from" : "Pin on"} homepage
                                                            </button>  
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={(e)=> {e.stopPropagation(); setPublishStatus(post.id, false)}}
                                                                className={`${
                                                                active ? 'bg-gray-300' : null
                                                                } group flex text-gray-900 focus:outline-none rounded-md items-center w-full px-2 py-2 text-sm`}
                                                            >
                                                                Revert to draft
                                                            </button>  
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        <Link href={`/post/${post.id}/settings`}>
                                                            <a className='text-gray-900 hover:bg-gray-300 group flex rounded-md items-center w-full px-2 py-2 text-sm'>
                                                                Settings
                                                            </a>
                                                        </Link>
                                                    </Menu.Item>
                                                </div>
                                                <div className="px-1 py-1">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                    <button
                                                        onClick={(e)=> e.stopPropagation()}
                                                        className={`${
                                                        active ? 'bg-red-300 text-red-700' : 'text-red-700'
                                                        } group flex focus:outline-none rounded-md items-center w-full px-2 py-2 text-sm`}
                                                    >
                                                        Delete
                                                    </button>
                                                    )}
                                                </Menu.Item>
                                                </div>
                                            </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>
                                </div>
                            </Link>
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
                },
                published: true
            },
            include: {
                pinnedPost: true
            },
            orderBy: {
                createdAt: 'desc'
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