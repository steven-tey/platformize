// pages/drafts.tsx

import React from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../components/Layout'
import prisma from '../lib/prisma'

export default function About ({about}) {

  return (
    <Layout
      publicationName={about.name}
      pageTitle={about.name}
      description={about.description}
      logo={about.logo}
    >
      <div className="relative m-auto mt-20 sm:w-1/2 text-center bg-white overflow-hidden">
        <h1 className="mt-2 block text-4xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            {about.name}
        </h1>
        <p className="mt-16 text-2xl text-gray-500 leading-8">
          {about.description}
        </p>
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

  return {
    props: {
      about
    },
  }
}