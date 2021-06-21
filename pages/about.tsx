// pages/drafts.tsx

import React from 'react'
import { GetServerSideProps } from 'next'
import Layout from '../components/Layout'
import prisma from '../lib/prisma'

export default function About ({about}) {

  return (
    <Layout>
      {about.name}
      {about.description}
      {about.users.map((item) => (
        <div>
          {item.user.name}
          {item.role}
        </div>
      ))}
    </Layout>
  )
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const { req, res } = ctx
  res.setHeader(
      'Cache-Control',
      'public, s-maxage=1, stale-while-revalidate=59'
  );
  const subdomain = process.env.NODE_ENV === 'production'? req?.headers?.host?.split('.')[0] : 'steven'

  const about = await prisma.publication.findUnique({
    where: {
      url: subdomain
    },
    select: {
      name: true,
      description: true,
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