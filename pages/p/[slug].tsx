// pages/p/[id].tsx

import React from 'react'
import { GetServerSideProps } from 'next'
//import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
import prisma from '../../lib/prisma'

export default function Post ({post}) {

  return (
    <Layout
      title={post.Publication.name}
      description={post.Publication.description}
      thumbnail="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
    >
      <div className="relative m-auto mt-10 w-1/2 bg-white overflow-hidden">
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="text-lg max-w-prose mx-auto">
            <h1 className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {post.title}
            </h1>
            <p className="mt-8 text-xl text-gray-500 leading-8">
              {post.content}
            </p>
          </div>
        </div>
      </div>
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

  const { slug } = ctx.query;

  const post = await prisma.post.findUnique({
    where: {
      slug_publication_constraint: {
        publicationUrl: subdomain,
        slug: slug,
      }
    },
    select: {
      title: true,
      content: true,
      Publication: {
        select: {
          name: true,
          description: true
        }
      }
    }
  })

  console.log(post)

  return {
    props: {
      post
    },
  }
}