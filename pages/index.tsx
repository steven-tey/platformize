import Layout from "../components/Layout"
import Link from "next/link"
import React from "react"
import { GetServerSideProps } from "next"
import prisma from '../lib/prisma'
import { getSession } from 'next-auth/client'
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'

export default function Index({feed, role}) {
  const parsedFeed = JSON.parse(feed)

  const [open, setOpen] = useState(true)
  const cancelButtonRef = useRef(null)

  return (
    <Layout>
      <main>
      {role == 'Admin' ?
        <>
          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              static
              className="fixed z-10 inset-0 overflow-y-auto"
              initialFocus={cancelButtonRef}
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
                  <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <div>
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                          {parsedFeed.name}
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            {parsedFeed.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                        onClick={() => setOpen(false)}
                      >
                        Deactivate
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
        </>
        : null
      }
      <div className="bg-white pt-16 pb-20 px-0 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="relative w-8/12 mx-auto divide-y-2 divide-gray-200 lg:max-w-7xl">
          <div>
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">{parsedFeed.name}</h2>
            <div className="mt-3 sm:mt-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:items-center">
              <p className="text-xl text-gray-500">{parsedFeed.description}</p>
              <form className="mt-6 flex flex-col sm:flex-row lg:mt-0 lg:justify-end">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email-address"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none w-full px-4 py-2 border border-gray-300 text-base rounded-md text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 lg:max-w-xs"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mt-2 flex-shrink-0 w-full flex rounded-md shadow-sm sm:mt-0 sm:ml-3 sm:w-auto sm:inline-flex">
                  <button
                    type="button"
                    className="w-full bg-indigo-600 px-4 py-2 border border-transparent rounded-md flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:inline-flex"
                  >
                    Notify me
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="mt-6 pt-10 grid gap-16 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-12">
            {parsedFeed.posts.map((post) => (
              <Link href={`/p/${post.slug}`}><a><div key={post.title}>
                <p className="text-sm text-gray-500">
                  {/*<time dateTime={post.datetime}>{post.date}</time>*/}
                  Mar 12, 2020
                </p>
                <div className="mt-2 block">
                  <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                  <p className="mt-3 text-base text-gray-500">{post.content}</p>
                </div>
                <div className="mt-3">
                  <p className="text-base font-semibold text-indigo-600 hover:text-indigo-500">
                    Read full story
                  </p>
                </div>
              </div>
              </a></Link>
            ))}
          </div>
        </div>
      </div>
      </main>
    </Layout>
  )
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, res } = ctx
  res.setHeader(
      'Cache-Control',
      'public, s-maxage=1, stale-while-revalidate=59'
  );
  const subdomain = process.env.NODE_ENV === 'production'? req.headers.host.split('.')[0] :'steven'
  
  const session = await getSession(ctx)
  const userId = process.env.NODE_ENV === 'production'? session.user.id :'ckpzubjcs00122nwgk8hpra6i'
  
  // Check if user is the owner of the current publication
  const authPub = await prisma.publicationUser.findMany({
    where: {
      publication: {
        url: subdomain
      },
      user: {
        id: userId
      }
    }
  })

  const role = authPub.length > 0 ? authPub[0].role : 'Guest'

  const feed = JSON.stringify(await prisma.publication.findUnique({
    where: { 
      url: subdomain
    },
    include: {
      posts: {  
        where: {
          published: true
        },    
        orderBy: [
          {
            createdAt: 'desc',
          }
        ]
      }
    }
  }))

  return { props: { feed, role } }
}