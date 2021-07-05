// pages/p/[id].tsx

import React from 'react'
import Layout from '../../components/Layout'
import Image from 'next/image'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import prisma from '../../lib/prisma'
import { getPlaiceholder } from "plaiceholder";

const plaiceholder = async (path) => {
    try {
      const base64 = await getPlaiceholder(path)
      return base64
    } catch (err) {
      err;
    }
}  

export default function PostPage (props) {

  return (
    <Layout
      publicationName={props.publicationName}
      pageTitle={props.postTitle}
      description={props.description}
      logo={props.logo}
    >
      <div className="relative m-auto mt-20 sm:w-1/2 text-center bg-white overflow-hidden">
          <h1 className="mt-2 block text-4xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              {props.postTitle}
          </h1>
          <p className="mt-16 text-2xl text-gray-500 leading-8">
          {props.description}
          </p>
      </div>
      <div className="w-full sm:w-8/12 mx-auto mt-16 overflow-hidden sm:rounded-lg shadow-2xl">
          <Image
          width={2048}
          height={1170}
          layout="responsive"
          placeholder="blur"
          blurDataURL={props.placeholder.base64}
          src={props.thumbnail}
          />
      </div>

      <div 
          dangerouslySetInnerHTML={{ __html: props.content }} 
          className="m-auto mt-20 mb-48 w-10/12 text-lg sm:w-1/2 sm:text-2xl sm:leading-relaxed text-gray-800 leading-relaxed space-y-6"
      />

    </Layout>
  )
}

export async function getServerSideProps(ctx) {

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
          }))?.url,
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

  post.placeholder = await plaiceholder(post?.image)

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
      placeholder: post.placeholder,
      content: contentHtml,
    },
  }
}