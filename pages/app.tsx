import AppLayout from "../components/AppLayout"
import Link from "next/link"
import Image from "next/image"
import {useRouter} from "next/router"
import React, {Fragment, useState} from "react"
import prisma from '../lib/prisma'
import { getSession } from 'next-auth/client'
import { Menu, Transition, Dialog } from '@headlessui/react'
import {
  ExternalLinkIcon,
  CogIcon,
  PlusIcon,
} from '@heroicons/react/outline'
import { ExclamationIcon } from "@heroicons/react/solid"
import getConfig from 'next/config'

function stopPropagation(e) {
  e.stopPropagation();
}
function preventDefault(e) {
  e.preventDefault();
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Index (props) {

    const {publicRuntimeConfig} = getConfig()
    const {NODE_ENV, APP_SLUG} = publicRuntimeConfig

    const [open, setOpen] = useState(false)
    const [creating, setCreating] = useState(false)
    const [subdomainError, setSubdomainError] = useState(false)

    const [openDelete, setOpenDelete] = useState(false)  
    const [pubToDelete, setPubToDelete] = useState('')
    const [deleting, setDeleting] = useState(false)

    const router = useRouter()
    
    async function createPublication(e, userId) {
        setSubdomainError(false)
        const res = await fetch(
            `/api/create-publication?name=${e.target.name.value}&url=${e.target.subdomain.value}&description=${e.target.description.value}&userId=${userId}`, 
            { method: 'POST' }
        )
        if (res.ok) {
          const data = await res.json()
          setTimeout(() => {
              router.push(NODE_ENV === 'production' ? `/publication/${data.publicationId}` : `/${APP_SLUG}/publication/${data.publicationId}`)
          }, 800)
        } else {
          setCreating(false)
          setSubdomainError(true)
        }
    }
    async function deletePublication(publicationId) {
      setDeleting(true)
      const res = await fetch(
          `/api/delete-publication?publicationId=${publicationId}`, 
          { method: 'POST' }
      )
      if (res.ok) {
        window.location.reload()
      }
    }

    return (
      <>
        <AppLayout>
          {/* Create Publication Overlay */}
          <Transition.Root show={open} as={Fragment}>
              <Dialog
                  as="div"
                  static
                  className="fixed z-50 inset-0 overflow-y-auto"
                  open={open}
                  onClose={setOpen}
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
                      <form onSubmit={(event) => {event.preventDefault(); setCreating(true); createPublication(event, props.session?.user?.id)}} className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                          <div className="bg-white px-4 pt-5 sm:p-6 sm:pb-4">
                              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                  <Dialog.Title as="h3" className="text-2xl text-center mt-3 leading-6 font-semibold text-gray-900">
                                  Create a new publication
                                  </Dialog.Title>
                                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                                  <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Name
                                      </label>
                                      <div className="mt-1 sm:mt-0 sm:col-span-3">
                                          <input
                                            type="text"
                                            name="name"
                                            autoComplete="off"
                                            required
                                            className="rounded-md border border-solid border-gray-300  w-full focus:outline-none min-w-0 sm:text-sm"
                                          />
                                      </div>
                                    </div>

                                    <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Subdomain
                                      </label>
                                      <div className="mt-1 sm:mt-0 sm:col-span-3">
                                        <div className="max-w-lg flex rounded-md shadow-sm border border-solid border-gray-300">
                                          <input
                                            type="text"
                                            name="subdomain"
                                            autoComplete="off"
                                            required
                                            className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-l-md sm:text-sm border-gray-300"
                                          />
                                          <span className="inline-flex items-center px-3 w-1/2 rounded-r-md border-t-0 border-r-0 border-b-0 border border-l-1 border-gray-300 bg-gray-100 text-gray-600 sm:text-sm">
                                            .{props.rootUrl}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    {subdomainError && <p className="text-sm text-red-600 mt-5">This subdomain is taken. Please choose another one.</p>}

                                    <div className="sm:grid sm:grid-cols-4 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                      <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                        Description
                                      </label>
                                      <div className="mt-1 sm:mt-0 sm:col-span-3">
                                        <textarea
                                          name="description"
                                          rows={3}
                                          placeholder="The hottest gossip about armadilos"
                                          className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                                        />
                                      </div>
                                    </div>
                                  </div>
                              </div>
                          </div>
                          <div className="bg-gray-50 mt-10 px-4 pb-6 sm:px-6 sm:flex sm:flex-row-reverse">
                              <button
                              type="submit"
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                              >
                                  {creating ? 
                                      <>
                                          Creating publication...
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
                                  : "Create Publication" }
                              </button>
                              <button
                              type="button"
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                              onClick={() => {setOpen(false); setCreating(false)}}
                              >
                              Cancel
                              </button>
                          </div>
                      </form>
                  </Transition.Child>
                  </div>
              </Dialog>
          </Transition.Root>
          
          {/* Delete Publication Overlay */}
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
                          Delete publication
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to delete this publication? All of your data (posts, associated users) will be permanently removed
                            from our servers forever. This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => deletePublication(pubToDelete)}
                      >
                        {deleting ? 
                          <>
                              Deleting publication...
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
                      : "Delete publication" }
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

          <div className="w-11/12 sm:w-7/12 mx-auto mt-16">
            <div className="flex justify-between px-4">
              <h1 className="font-bold text-2xl sm:text-3xl m-5 mb-10">
                My Publications
              </h1>
              <button onClick={()=>setOpen(true)} className="bg-gray-900 px-5 h-12 mt-3 sm:mt-5 rounded-3xl text-base sm:text-lg text-white hover:bg-gray-700 focus:outline-none">
                New Publication
                <PlusIcon
                    className="h-5 w-5 inline-block ml-2"
                />
              </button>
            </div>
            {props.publications.length == 0 ?
            <>
              <img src="/empty-state.webp" />
              <p className="text-center mb-48 mt-10 text-gray-800 font-semibold text-xl">No publications yet. Click the button above to create one.</p>
            </>
            : null}
            {props.publications.map((publication) => (
              <Link href={NODE_ENV === 'production' ? `/publication/${publication.id}` : `/${APP_SLUG}/publication/${publication.id}`}>
                <a>
                <div className="sm:px-5 sm:flex space-y-5 sm:space-y-0 sm:space-x-10 mb-10 py-5 rounded-lg cursor-pointer hover:bg-gray-100">
                  <div className="w-10/12 mx-auto sm:w-1/3 overflow-hidden rounded-lg">
                    <Image
                      width={2048}
                      height={1170}
                      layout="responsive"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
                      src={publication.image}
                      />
                  </div>
    
                  <div className="relative w-10/12 mx-auto sm:w-7/12 space-y-2 sm:space-y-3">
                  <Menu onClick={preventDefault} as="div" className="absolute right-0 top-0 mr-3 mt-3">
                    <div>
                      <a onClick={stopPropagation} href={`https://${publication.url}.${props.rootUrl}`} target="_blank" 
                      >
                        <ExternalLinkIcon
                            className="h-6 w-6 inline-block sm:hidden"
                        />
                      </a>
                      <Menu.Button className="p-2 text-black rounded-full hover:bg-gray-400 focus:outline-none">
                        <CogIcon
                          className="h-6 w-6 inline-block"
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
                              <Link href={NODE_ENV === 'production' ? `/publication/${publication.id}` : `/${APP_SLUG}/publication/${publication.id}`}>
                                <a className='text-gray-900 hover:bg-gray-300 group flex rounded-md items-center w-full px-2 py-2 text-sm'>
                                  Posts
                                </a>
                              </Link>
                          </Menu.Item>
                          <Menu.Item>
                            <Link href={NODE_ENV === 'production' ? `/publication/${publication.id}/drafts` : `/${APP_SLUG}/publication/${publication.id}/drafts`}>
                              <a className='text-gray-900 hover:bg-gray-300 group flex rounded-md items-center w-full px-2 py-2 text-sm'>
                                Drafts
                              </a>
                            </Link>
                          </Menu.Item>
                          <Menu.Item>
                              <Link href={NODE_ENV === 'production' ? `/publication/${publication.id}/settings` : `/${APP_SLUG}/publication/${publication.id}/settings`}>
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
                                onClick={()=> {setOpenDelete(true); setPubToDelete(publication.id)}}
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
                    <p className="text-xl sm:text-3xl font-semibold text-gray-900">{publication.name}</p>
                    <p className="text-base sm:text-lg text-gray-600 truncate w-9/12 sm:w-10/12">{publication.description}</p>
                    <a onClick={stopPropagation} href={`https://${publication.url}.${props.rootUrl}`} target="_blank" 
                      className="absolute bg-gray-900 hidden sm:block py-3 px-8 rounded-3xl text-lg text-white hover:bg-gray-700"
                    >
                      {publication.url}.{props.rootUrl}
                      <ExternalLinkIcon
                          className="h-5 w-5 inline-block ml-2"
                      />
                    </a>
                  </div>
                </div>
                </a>
              </Link>
            ))}
          </div>
        </AppLayout>
      </>
    )
}

export async function getServerSideProps(ctx) {

    const session = await getSession(ctx)
    const publications = await prisma.publication.findMany({
        where: {
        users: {
            some: {
            userId: session?.user?.id
            }
        }
        }
    })
    return {
        props: {
        session: session,
        rootUrl: process.env.ROOT_URL,
        publications: publications
        }
    }
}