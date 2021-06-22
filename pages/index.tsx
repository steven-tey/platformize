import Layout from "../components/Layout"
import Link from "next/link"
import Image from "next/image"
import React from "react"
import prisma from '../lib/prisma'

export default function Index({publicationName, publicationDescription, publicationLogo, posts}) {
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

export async function getServerSideProps(ctx) {
  
  const { req, res } = ctx
  const subdomain = process.env.NODE_ENV === 'production'? req?.headers?.host?.split('.')[0] : 'steven'
  if (subdomain == process.env.APP_SLUG) {
    
  } else {
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
        publicationName: data.name,
        publicationDescription: data.description,
        publicationLogo: data.logo,     
        posts: JSON.stringify(data.posts)
      } 
    }
  }
}