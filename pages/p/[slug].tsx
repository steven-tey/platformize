// pages/p/[id].tsx

import React from 'react'
import { GetServerSideProps } from 'next'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import Layout from '../../components/Layout'
import prisma from '../../lib/prisma'
import Image from 'next/image'

export default function Post ({publicationName, postTitle, description, logo, thumbnail, content}) {

  return (
    <Layout
      publicationName={publicationName}
      pageTitle={postTitle}
      description={description}
      logo={logo}
    >
      <div className="relative m-auto mt-20 sm:w-1/2 text-center bg-white overflow-hidden">
        <h1 className="mt-2 block text-4xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            {postTitle}
        </h1>
        <p className="mt-16 text-2xl text-gray-500 leading-8">
          {description}
        </p>
      </div>
      <div className="relative sm:w-8/12 mx-auto mt-16 h-700 p-10 overflow-hidden rounded-lg shadow-2xl">
        <Image
          layout="fill"
          objectFit="cover"
          src={thumbnail}
        />
      </div>

      <div 
        dangerouslySetInnerHTML={{ __html: content }} 
        className="m-auto mt-20 mb-48 sm:w-1/2 text-2xl text-gray-800 leading-relaxed space-y-6"
      />

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

  if (subdomain == process.env.APP_SLUG) {
    return {
      redirect: {
        destination: '/',
        statusCode: 302
      }
    }
  }

  const { slug } = ctx.query;

  let constraint = {
    publicationUrl: subdomain,
    slug: slug,
  }

  if (domain.substr(domain.indexOf('.')+1) != process.env.ROOT_URL) {
    constraint = {
      publicationUrl: (await prisma.publication.findUnique({
        where:{
          customDomain: domain
        },
        select: {
          url: true
        }
      })).url,
      slug: slug,
    }
  }
  
  const post = await prisma.post.findUnique({
    where: {
      slug_publication_constraint: constraint,
    },
    include: {
      Publication: {
        select: {
          name: true,
          description: true,
          logo: true
        }
      }
    }
  })

  const matterResult = matter(post?.content)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    props: {
      publicationName: post?.Publication.name,
      postTitle: post?.title,
      description: post?.description,
      logo: post?.Publication.logo,
      thumbnail: post?.image,
      content: contentHtml,
    },
  }
}