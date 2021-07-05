// pages/drafts.tsx

import React from 'react'
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

export default function About ({about}) {

  return (
    <Layout
      publicationName={about.name}
      pageTitle={about.name}
      description={about.description}
      logo={about.logo}
    >
      <div className="relative m-auto mt-20 sm:w-1/2 bg-white overflow-hidden">
        <h1 className="mt-2 block text-4xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            {about.name}
        </h1>
      </div>
      <div className="w-full sm:w-8/12 mx-auto mt-16 overflow-hidden sm:rounded-lg shadow-2xl">
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
        className="m-auto mt-20 mb-48 w-10/12 text-lg sm:w-1/2 sm:text-2xl sm:leading-relaxed text-gray-800 leading-relaxed space-y-6"
        dangerouslySetInnerHTML={{ __html: about.description }} 
      />

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
  const subdomain = process.env.NODE_ENV === 'production'? req?.headers?.host?.split('.')[0] : 'steven'

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
              name: true
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