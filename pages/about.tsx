// pages/drafts.tsx

import React, {useState} from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../components/Layout'
import prisma from '../lib/prisma'
import Image from 'next/image'
import { getPlaiceholder } from "plaiceholder";

const plaiceholder = async (path) => {
    try {
      const base64 = await getPlaiceholder(path)
      return base64
    } catch (err) {
      err;
    }
}  

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function About ({about}) {

  const [tab, setTab] = useState("about")

  return (
    <Layout
      publicationName={about.name}
      pageTitle={about.name}
      description={about.description}
      logo={about.logo}
    >
      <div className="relative w-full sm:w-6/12 mt-6 mx-auto">
        <div className="flex justify-start px-3 sm:px-0 text-sm sm:text-base space-x-3 sm:space-x-8">
          <button
            onClick={() => setTab("about")}
            className={classNames(
              tab == "about" ? 'text-indigo-600 border-indigo-600 font-semibold' : 'border-white',
              'py-2 border-b-2'
            )}
          >
            About
          </button>
          <button
            onClick={() => setTab("writers")}
            className={classNames(
              tab == "writers" ? 'text-indigo-600 border-indigo-600 font-semibold' : 'border-white',
              'py-2 border-b-2'
            )}
          >
            Writers
          </button>
        </div>
        {
          tab == 'about' &&
          <>
            <div>
              <h1 className="mt-10 block text-2xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  What is {about.name}?
              </h1>
              <div className="w-full mt-8 overflow-hidden sm:rounded-lg shadow-2xl">
                  <Image
                  width={2048}
                  height={1170}
                  layout="responsive"
                  placeholder="blur"
                  blurDataURL={about.placeholder.base64}
                  src={about.image}
                  />
              </div>
              <div
                className="m-auto mt-8 mb-48 text-lg sm:text-xl sm:leading-relaxed text-gray-800 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: about.description }} 
              />
            </div>
          </>
        }
        {
          tab == 'writers' &&
          <>
            <div className="mt-10">
              {about.users.map((user) =>(
                <div className="my-10">
                  <img 
                    src={user.user.image}
                    className="w-20 h-20 rounded-full inline-block"
                  />
                  <h2 className="inline-block ml-8 text-xl font-semibold">{user.user.name}</h2>
                </div>
              ))} 
            </div>
          </>
        }
      </div>

      <div className="h-350 w-screen"></div>

    </Layout>

  )
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const { req, res } = ctx
  res.setHeader(
      'Cache-Control',
      'public, s-maxage=1, stale-while-revalidate=59'
  );
  const domain = process.env.NODE_ENV === 'production'? req?.headers?.host : `${process.env.CURR_SLUG}.${process.env.ROOT_URL}`
  const subdomain = process.env.NODE_ENV === 'production'? req?.headers?.host?.split('.')[0] : process.env.CURR_SLUG

  let filter = {
    url: subdomain
  }

  if (domain.substr(domain.indexOf('.')+1) != process.env.ROOT_URL) {
    filter = {
      customDomain: domain
    }
  }

  const about = await prisma.publication.findUnique({
    where: filter,
    include: {
      users: {
        select: {
          user: {
            select: {
              name: true,
              image: true,
            }
          },
          role: true
        }
      }
    }
  })
  about.placeholder = await plaiceholder(about.image)

  return {
    props: {
      about
    },
  }
}