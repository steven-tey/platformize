// pages/p/[id].tsx

import React from 'react'
import { GetServerSideProps } from 'next'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import Layout from '../../components/Layout'
import prisma from '../../lib/prisma'
import Image from 'next/image'

export default function Post ({blogTitle, postTitle, description, thumbnail, content}) {

  return (
    <Layout
      blogTitle={blogTitle}
      pageTitle={postTitle}
      description={description}
      logo="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
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
          src={`/blog/${thumbnail}`}
        />
      </div>

      <div className="h-700 w-screen"></div>
      
      {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}

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
      description: true,
      content: true,
      image: true,
      Publication: {
        select: {
          name: true,
          description: true
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
  console.log(contentHtml)

  return {
    props: {
      blogTitle: post?.Publication.name,
      postTitle: post?.title,
      description: post?.description,
      thumbnail: post?.image,
      content: contentHtml,
    },
  }
}