// pages/[id]/about.tsx

import React, {useState} from 'react'
import Layout from '../../../components/Layout'
import Claim from "../../../components/Claim"
import prisma from '../../../lib/prisma'
import Image from 'next/image'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function About (props) {

  if (!props.name) {
    return <Claim subdomain={props.subdomain} rootUrl={props.rootUrl}/>
  }
  const [tab, setTab] = useState("about")

  return (
    <Layout
        subdomain={props.subdomain}
        publicationName={props.name}
        pageTitle={props.name}
        description={props.description}
        logo={props.logo}
        thumbnail={props.image}
    >
      <div className="relative w-11/12 sm:w-6/12 mt-6 mx-auto">
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
                  What is {props.name}?
              </h1>
              <div className="w-full mt-8 overflow-hidden sm:rounded-lg shadow-2xl">
                  <Image
                  width={2048}
                  height={1170}
                  layout="responsive"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
                  src={props.image}
                  />
              </div>
              <div
                className="m-auto mt-8 mb-48 text-lg sm:text-xl sm:leading-relaxed text-gray-800 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: props.description }} 
              />
            </div>
          </>
        }
        {
          tab == 'writers' &&
          <>
            <div className="mt-10">
              {props.users.map((user) =>(
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

export async function getStaticPaths() {
    const subdomains = await prisma.publication.findMany({
        select: {
            url: true,
        }
    })
    const customDomains = await prisma.publication.findMany({
        where: {
          NOT: {
            customDomain: null
          }
        },
        select: {
            customDomain: true,
        }
    })
    const allPaths = [...subdomains.map((subdomain) => {return subdomain.url}), ...customDomains.map((customDomain) => {return customDomain.customDomain})]
    return {
        paths: allPaths.map((path) => {
            return  { params: { id: path } }
        }),
        fallback: "blocking"
    }
}

export async function getStaticProps({params: { id }}) {

    let filter = {
      url: id
    }
    if (id.includes('.')) {
      filter = {
        customDomain: id
      }
    }

    const data = await prisma.publication.findUnique({
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

    return {
        props: {
            subdomain: id,
            rootUrl: process.env.ROOT_URL,
            ...data
        },
        revalidate: 10
    }
}