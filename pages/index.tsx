import Layout from "../components/Layout"
import AppLayout from "../components/AppLayout"
import Link from "next/link"
import Image from "next/image"
import React, {Fragment} from "react"
import prisma from '../lib/prisma'
import withAuth from "../lib/withAuth"
import { getSession } from 'next-auth/client'
import { Menu, Transition } from '@headlessui/react'
import {
  ExternalLinkIcon,
  CogIcon,
  PlusIcon,
} from '@heroicons/react/outline'

function stopPropagation(e) {
  e.stopPropagation();
}

const settings = [
  {name: 'Drafts', slug: 'drafts'},
  {name: 'Settings', slug: 'settings'},
]

const Index = ({app, rootUrl, session, publications, publicationName, publicationDescription, publicationLogo, posts}) => {

  // If it's the app subdomain (e.g. app.yourdomain.com)
  if (app) {
    return (
      <>
        <AppLayout
          name={session?.user?.name}
          email={session?.user?.email}
        >
          <div className="w-7/12 mx-auto mt-16">
            <div className="flex justify-between">
              <h1 className="font-bold text-3xl m-5 mb-10">
                My Publications
              </h1>
              <button className="bg-gray-900 px-5 h-12 mt-5 rounded-3xl text-lg text-white hover:bg-gray-700">
                New Publication
                <PlusIcon
                    className="h-5 w-5 inline-block ml-2"
                />
              </button>
            </div>
            {publications.map((publication) => (
              <Link href={`/publication/${publication.id}`}>
                <div className="sm:px-5 sm:flex sm:space-x-10 mb-10 py-5 h-250 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300">
                  <div className="relative sm:w-5/12 h-full p-10 overflow-hidden rounded-lg">
                    <Image
                      layout="fill"
                      objectFit="cover"
                      src={`/blog/pure-ui.webp`}
                      />
                  </div>
    
                  <div className="relative w-7/12 space-y-5">
                  <Menu onClick={stopPropagation} as="div" className="absolute right-0 top-0 mr-3 mt-3 z-20">
                    <div>
                      <Menu.Button className="p-2 text-black rounded-full hover:bg-gray-400 focus:outline-none">
                        <CogIcon
                          className="h-6 w-6"
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
                      <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-300 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                          <Menu.Item>
                              {({ active }) => (
                                <Link href={`/publication/${publication.id}`}>
                                  <a className='text-gray-900 hover:bg-gray-300 group flex rounded-md items-center w-full px-2 py-2 text-sm'>
                                    Posts
                                  </a>
                                </Link>
                              )}
                            </Menu.Item>
                          {settings.map((item) => (
                            <Menu.Item>
                              {({ active }) => (
                                <Link href={`/publication/${publication.id}/${item.slug}`}>
                                  <a className='text-gray-900 hover:bg-gray-300 group flex rounded-md items-center w-full px-2 py-2 text-sm'>
                                    {item.name}
                                  </a>
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                        <div className="px-1 py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
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
                    <p className="text-3xl font-semibold text-gray-900">{publication.name}</p>
                    <p className="mt-3 text-lg text-gray-600">{publication.description}</p>
                    <a onClick={stopPropagation} href={`https://${publication.url}.${rootUrl}`} target="_blank" className="absolute bg-gray-900 py-3 px-8 rounded-3xl text-lg text-white hover:bg-gray-700">
                      {publication.url}.{rootUrl}
                      <ExternalLinkIcon
                          className="h-5 w-5 inline-block ml-2"
                      />
                    </a>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </AppLayout>
      </>
    )
  
  // If it's any other subdomain (e.g. john.yourdomain.com, test.yourdomain.com)
  } else {
    const parsedPosts = JSON.parse(posts)
    const pinnedPost = parsedPosts.filter(post => {
      return post.pinnedPost.length > 0
    })[0]
  
    return (
      <Layout
        publicationName={publicationName}
        pageTitle={publicationName}
        description={publicationDescription}
        logo={publicationLogo}
      >
        <main>
        <div className="bg-white pb-20 px-0 sm:px-6 lg:pb-28 lg:px-8">
          <div className="relative w-10/12 sm:w-7/12 h-350 mx-auto lg:max-w-7xl">
            <Link href={`/p/${pinnedPost.slug}`}><a>
              <div className="sm:px-10 sm:flex sm:space-x-10 py-16 h-full hover:bg-gray-200">
                <div className="relative sm:w-10/12 h-full p-10 overflow-hidden rounded-lg">
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={`/blog/${pinnedPost.image}`}
                    />
                </div>
  
                <div className="mt-2">
                  <p className="text-3xl font-semibold text-gray-900">{pinnedPost.title}</p>
                  <p className="mt-3 text-lg text-gray-500">{pinnedPost.description}</p>
                </div>
              </div>
            </a></Link>
          </div>
          <div className="relative w-6/12 mx-auto">
            <div className="mt-6 pt-10 grid gap-5">
              {parsedPosts.map((post) => (
                <Link href={`/p/${post.slug}`}><a>
                  <div key={post.title} className="p-5 hover:bg-gray-200">
                    <p className="text-sm text-gray-500">
                      <time dateTime={post.createdAt}>
                        {`${Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(post.createdAt))} ${Intl.DateTimeFormat('en', { day: '2-digit' }).format(new Date(post.createdAt))}`}
                      </time>
                    </p>
                    <div className="mt-2 block">
                      <p className="text-2xl font-semibold text-gray-900">{post.title}</p>
                      <p className="mt-3 text-base text-gray-500">{post.description}</p>
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
}

export async function getServerSideProps(ctx) {
  
  const { req, res } = ctx
  const subdomain = process.env.NODE_ENV === 'production'? req?.headers?.host?.split('.')[0] : process.env.CURR_SLUG

  if (subdomain == process.env.APP_SLUG) { // If it's the app subdomain (e.g. app.yourdomain.com)
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
        app: true,
        rootUrl: process.env.ROOT_URL,
        session: session,
        publications: publications
      }
    }
  } else { // If it's any other subdomain (e.g. john.yourdomain.com, test.yourdomain.com)
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=1, stale-while-revalidate=59'
    );
    const data = await prisma.publication.findUnique({
      where: { 
        url: subdomain
      },
      include: {
        posts: {  
          where: {
            published: true,
          },
          include: {
            pinnedPost: true
          },
          orderBy: [
            {
              createdAt: 'desc',
            }
          ]
        },
      }
    })
    if (!data) { // if site doesn't exist
      return {
        redirect: {
          destination: '/claim-site',
          statusCode: 302
        }
      }
    }
    return { 
      props: { 
        app: false,
        publicationName: data.name,
        publicationDescription: data.description,
        publicationLogo: data.logo,     
        posts: JSON.stringify(data.posts)
      } 
    }
  }
}

export default withAuth(Index)