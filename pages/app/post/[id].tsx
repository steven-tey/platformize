import AppLayout from '../../../components/AppLayout'
import { getSession } from 'next-auth/client'
import prisma from '../../../lib/prisma'
import Link from 'next/link'
import { useState, useEffect, useRef} from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import { AnnotationIcon, PaperClipIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid'
import {useRouter} from 'next/router'
import getConfig from 'next/config'

export default function Post ({post, rootUrl}) {

    const {publicRuntimeConfig} = getConfig()
    const {NODE_ENV, APP_SLUG} = publicRuntimeConfig

    const parsedPost = JSON.parse(post)
    const [savedState, setSavedState] = useState(`Last save ${Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(parsedPost.updatedAt))} ${Intl.DateTimeFormat('en', { day: '2-digit' }).format(new Date(parsedPost.updatedAt))} at ${Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' }).format(new Date(parsedPost.updatedAt))}`)
    const [title, setTitle] = useState(parsedPost.title)
    const [description, setDescription] = useState(parsedPost.description)
    const [content, setContent] = useState(parsedPost.content)
    const [publishing, setPublishing] = useState(false)
    const firstRender = useRef(false);

    useEffect(() => {
        window.addEventListener("keydown", function(e) {
            if (e.keyCode >= 65 && e.keyCode <= 90) {
                var char = (e.metaKey ? '⌘-' : '') + String.fromCharCode(e.keyCode)
                if (char == '⌘-S') {
                    e.preventDefault()
                    saveChanges(title, description, content)
                }
            }
        });
    }, [title, description, content])

    useEffect(() => {
        if (firstRender.current) {
            setSavedState("Unsaved changes")
            let timer = setTimeout(() => {
                saveChanges(title, description, content)
            }, 3000);
            return () => {
                clearTimeout(timer);
            };
        } else {
            firstRender.current = true;
        }
    }, [title, description, content])

    async function saveChanges(title, description, content) {
        setSavedState("Saving changes...")
        const response = await fetch('/api/save', {
            method: 'POST', 
            body: JSON.stringify({id: parsedPost.id, title: title, description: description, content: content})
        })
        const data = await response.json()
        setSavedState(`Last save ${Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(data.updatedAt))} ${Intl.DateTimeFormat('en', { day: '2-digit' }).format(new Date(data.updatedAt))} at ${Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric' }).format(new Date(data.updatedAt))}`)
    }

    const router = useRouter()

    const publish = async (publicationId, postId, rootUrl, title, description, content) => {
        await saveChanges(title, description, content)
        const response = await fetch(`/api/publish?publicationId=${publicationId}&postId=${postId}`, {
            method: 'POST',
        })
        const data = await response.json()
        router.push(`https://${parsedPost.publicationUrl}.${rootUrl}/p/${data.slug}`)
    }

    return (
        <>
            <AppLayout>
                <div className="w-6/12 mx-auto mt-10 mb-16">
                    <Link href={NODE_ENV === 'production' ? `/publication/${parsedPost.Publication.id}` : `/${APP_SLUG}/publication/${parsedPost.Publication.id}`}>
                        <a className="text-left text-gray-800 font-semibold text-lg">
                            ← Back to All Posts
                        </a>
                    </Link>

                    <TextareaAutosize
                        name="title"
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-2 py-4 border-none text-gray-800 mt-6 text-4xl font-bold resize-none focus:outline-none"
                        placeholder="Enter post title..."
                        defaultValue={parsedPost.title}
                    />
                    <TextareaAutosize
                        name="description"
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-2 py-3 border-none text-gray-600 text-xl mb-3 resize-none focus:outline-none"
                        placeholder="Enter post description..."
                        defaultValue={parsedPost.description}
                    />
                    
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="relative z-0 inline-flex shadow-sm rounded-md -space-x-px">
                            <button
                                type="button"
                                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <span className="sr-only">Edit</span>
                                <PencilIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <span className="sr-only">Attachment</span>
                                <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <span className="sr-only">Annotate</span>
                                <AnnotationIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <span className="sr-only">Delete</span>
                                <TrashIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            </span>
                        </div>
                    </div>
                    <TextareaAutosize
                        name="content"
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-2 py-3 border-none text-gray-800 text-lg mb-5 resize-none focus:outline-none"
                        placeholder="Write some content here..."
                        defaultValue={parsedPost.content}
                    />
                </div>
                <footer className="h-20 z-10 fixed bottom-0 inset-x-0 border-solid border-t border-gray-500 bg-white">
                    <div className="w-6/12 mx-auto mt-3 flex justify-between">
                        <div className="text-sm mt-1">
                            <strong><p>{parsedPost.published? "Published" : "Draft"}</p></strong>
                            <p>{savedState}</p>
                        </div>
                        <div>
                            <Link href={NODE_ENV === 'production' ? `/post/${parsedPost.id}/settings` : `/${APP_SLUG}/post/${parsedPost.id}/settings`}>
                                <a className="text-lg mx-2">
                                    Settings
                                </a>
                            </Link>
                            <button 
                                onClick={()=> {publish(parsedPost.Publication.id, parsedPost.id, rootUrl, title, description, content); setPublishing(true)}}
                                className="mx-2 rounded-md py-3 px-6 bg-blue-500 hover:bg-blue-400 active:bg-blue-300 focus:outline-none text-lg text-white"
                            >
                                Publish
                                { publishing ? 
                                <svg
                                className="animate-spin ml-2 h-4 w-4 text-white inline-block"
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
                                : "  →"}
                            </button>
                        </div>
                    </div>
                </footer>
            </AppLayout>
        </>
    )
}

export async function getServerSideProps(ctx) {

    const { id } = ctx.query;  
    const session = await getSession(ctx)
    const post = await prisma.post.findUnique({
        where: {
            id: id
        },
        include: {
            Publication: true
        }
    })
    return {
        props: {
            session: session,
            post: JSON.stringify(post),
            rootUrl: process.env.ROOT_URL
        }
    }
}