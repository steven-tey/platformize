import AppLayout from '../../components/AppLayout'
import withAuth from '../../lib/withAuth'
import { getSession } from 'next-auth/client'
import prisma from '../../lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useState } from 'react'
import { Menu, Transition, Dialog } from '@headlessui/react'
import {
  ExternalLinkIcon,
  DotsHorizontalIcon,
  PlusIcon,
  ExclamationIcon,
} from '@heroicons/react/outline'
import {
    StarIcon
  } from '@heroicons/react/solid'

function stopPropagation(e) {
    e.stopPropagation();
}

const unpublish = async (publicationId, postId, slug) => {
    await fetch(`/api/unpublish?publicationId=${publicationId}&postId=${postId}&slug=${slug}`, {
        method: 'POST',
    })
    window.location.reload();
}

const pin = async (publicationId, slug, postId, pinStatus) => {
    await fetch(`/api/pin?publicationId=${publicationId}&slug=${slug}&postId=${postId}&pinStatus=${pinStatus}`, {
        method: 'POST',
    })
    window.location.reload();
}

const Publication = ({session, publication, posts, rootUrl}) => {
    const allPosts = JSON.parse(posts)
    const [creating, setCreating] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [postToDelete, setPostToDelete] = useState('')
    const [deleting, setDeleting] = useState(false)

    async function deletePost(postId) {
        setDeleting(true)
        const res = await fetch(
            `/api/delete?postId=${postId}&publicationId=${publication.id}&slug=${publication.url}&draft=${false}`, 
            { method: 'POST' }
        )
        if (res.ok) {
            window.location.reload()
        }
    }
    
    return (
        <>
            <AppLayout
                name={session?.user?.name}
                email={session?.user?.email}
                image={session?.user?.image}
            >
                {/* Delete Post Overlay */}
                <Transition.Root show={openDelete} as={Fragment}>
                    <Dialog
                    as="div"
                    static
                    className="fixed z-10 inset-0 overflow-y-auto"
                    open={openDelete}
                    onClose={setOpenDelete}
                    >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                        </span>
                        <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                Delete post
                                </Dialog.Title>
                                <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Are you sure you want to delete this post? All of your data will be permanently removed
                                    from our servers forever. This action cannot be undone.
                                </p>
                                </div>
                            </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() => deletePost(postToDelete)}
                            >
                                {deleting ? 
                                <>
                                    Deleting post...
                                    <svg
                                    className="animate-spin ml-3 mt-1 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                    </svg>
                                </>
                            : "Delete post" }
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                onClick={() => setOpenDelete(false)}
                            >
                                Cancel
                            </button>
                            </div>
                        </div>
                        </Transition.Child>
                    </div>
                    </Dialog>
                </Transition.Root>
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
                        <button 
                            onClick={() => {setCreating(true); }}
                            className="inline-flex justify-center bg-gray-900 px-5 py-2 h-12 mt-5 rounded-3xl text-lg text-white hover:bg-gray-700 focus:outline-none"
                        >
                            {creating ? 
                                <>
                                    Creating post...
                                    <svg
                                    className="animate-spin ml-3 mt-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                    </svg>
                                </>
                            : 
                            <>
                                New Post
                                <PlusIcon
                                    className="h-5 w-5 inline-block ml-2 mt-1"
                                />
                            </>}
                        </button>
                        </div>
                        {allPosts.map((post) => (
                            <Link href={`/post/${post.id}`}>
                                <div className="p-8 mb-3 pr-20 flex justify-between bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer">                    
                                    <div className="relative space-y-5">
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {post.title}
                                            {post.pinnedPost.length > 0 && <StarIcon
                                                className="w-6 h-6 inline-block align-top ml-1"
                                            />}
                                        </p>
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
                                                                onClick={(e)=> {
                                                                    e.stopPropagation();
                                                                    if (post.pinnedPost.length > 0) {
                                                                        pin(publication.id, publication.url, post.id, false)
                                                                    } else {
                                                                        pin(publication.id, publication.url, post.id, true)
                                                                    }
                                                                }}
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
                                                                onClick={(e)=> {e.stopPropagation(); unpublish(publication.id, post.id, publication.url,false)}}
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
                                                        onClick={()=>{setOpenDelete(true); setPostToDelete(post.id)}}
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