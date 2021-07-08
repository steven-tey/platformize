import Layout from "../components/Layout"
import Link from "next/link"
import Image from "next/image"
import React, {useState} from "react"
import prisma from '../lib/prisma'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
export default function Index({publicationUrl, posts, pinPost, publicationName, publicationDescription, publicationLogo}){

    const parsedPosts = JSON.parse(posts)
    const pinnedPost = JSON.parse(pinPost)
    const [sort, setSort] = useState("date")

    return (
      <Layout
        publicationUrl={publicationUrl}
        publicationName={publicationName}
        pageTitle={publicationName}
        description={publicationDescription}
        logo={publicationLogo}
      >
        <main>
        <div className="bg-white pb-20 px-0 sm:px-6 lg:pb-28 lg:px-8">
          {pinnedPost ? 
          <>
            <div className="relative w-11/12 sm:w-7/12 mx-auto lg:max-w-7xl">
              <Link href={`/p/${pinnedPost.slug}`}><a>
                <div className="grid grid-cols-1 sm:grid-cols-2 space-y-5 sm:space-x-3 py-16 hover:bg-gray-100 transition-all ease-in-out duration-100">
                  <div className="w-10/12 m-auto overflow-hidden rounded-lg">
                    <Image
                      width={2048}
                      height={1170}
                      layout="responsive"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
                      src={pinnedPost.image}
                      />
                  </div>
    
                  <div className="text-center sm:text-left sm:w-10/12">
                    <p className="text-3xl font-semibold text-gray-900">{pinnedPost.title}</p>
                    <p className="mt-3 text-lg text-gray-500">{pinnedPost.description}</p>
                  </div>
                </div>
              </a></Link>
            </div>
          </>
          :
          <>
            <div className="relative w-11/12 sm:w-7/12 h-350 mx-auto lg:max-w-7xl text-center">
              <h1 className="text-4xl font-bold">No posts yet!</h1>
            </div>
          </>
          }
          {}
          <div className="relative w-full sm:w-6/12 mt-6 mx-auto">
            <div className="flex justify-start px-3 sm:px-0 text-sm sm:text-base space-x-3 sm:space-x-8 border-b border-gray-200">
              <button
                onClick={() => setSort("date")}
                className={classNames(
                  sort == "date" ? 'text-indigo-600 border-indigo-600 font-semibold' : 'border-white',
                  'py-2 border-b-2'
                )}
              >
                New
              </button>
              <button
                onClick={() => setSort("likes")}
                className={classNames(
                  sort == "likes" ? 'text-indigo-600 border-indigo-600 font-semibold' : 'border-white',
                  'py-2 border-b-2'
                )}
              >
                Top
              </button>
              <Link href={`/about`}>
                <a className="py-2 border-b-2 border-white w-1/2 truncate">
                  What is {publicationName}?
                </a>
              </Link>
            </div>
            <div className="py-5 grid gap-5">
              {parsedPosts.map((post) => (
                <Link href={`/p/${post.slug}`}><a>
                  <div key={post.title} className="p-8 sm:p-5 hover:bg-gray-100 transition-all ease-in-out duration-100">
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

export async function getStaticPaths() {
    const publications = await prisma.publication.findMany({
        select: {
            url: true
        }
    })
    return {
        paths: publications.map((publication) => {
            return  { params: { id: publication.url } }
        }),
        fallback: false
    }
}

export async function getStaticProps({ params: {id} }) {
  
    const data = await prisma.publication.findUnique({
        where: {
            url: id
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

    const pinPost = data.posts.filter(post => {
        return post.pinnedPost.length > 0
    })[0]

    return { 
        props: { 
            publicationUrl: id,
            publicationName: data.name,
            publicationDescription: data.description,
            publicationLogo: data.logo,     
            posts: JSON.stringify(data.posts),
            pinPost: JSON.stringify(pinPost)
        } 
    }
}