// pages/[id]/archive.tsx

import Layout from '../../components/Layout'
import Claim from "../../components/Claim"
import prisma from '../../lib/prisma'
import Link from 'next/link'
import getConfig from 'next/config'
import Image from 'next/image'

export default function Archive (props) {

    const {publicRuntimeConfig} = getConfig()
    const {NODE_ENV} = publicRuntimeConfig

    const publication = JSON.parse(props.publication)
    if (!publication) {
        return <Claim subdomain={props.subdomain} rootUrl={props.rootUrl}/>
    }

    return (
        <Layout
            subdomain={props.subdomain}
            publicationName={publication.name}
            pageTitle={publication.name}
            description={publication.description}
            logo={publication.logo}
        >
      
            <div className="relative w-full md:w-1/2 mt-6 mx-auto">
                <div className="flex justify-start px-3 sm:px-8 text-sm sm:text-base space-x-3 sm:space-x-8">
                    <div className="text-indigo-600 border-indigo-600 font-semibold py-2 border-b-2">
                    Archive
                    </div>
                </div>
                <div className="py-5 grid gap-5">
                    {publication.posts.map((post) => (
                    <Link href={NODE_ENV === 'production' ? `/p/${post.slug}` : `/${props.subdomain}/p/${post.slug}`}><a>
                        <div key={post.title} className="grid grid-cols-1 md:grid-cols-7 sm:space-x-8 px-8 py-2 hover:bg-gray-100 transition-all ease-in-out duration-100">
                            <div className="w-full col-span-2 m-auto overflow-hidden rounded-lg">
                                <Image
                                width={2048}
                                height={1200}
                                layout="responsive"
                                objectFit="cover"
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
                                src={post.image}
                                />
                            </div>

                            <div className="text-center sm:text-left col-span-5 py-5">
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
                        </div>
                    </a></Link>
                    ))}
                </div>
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

export async function getStaticProps({ params: {id} }) {

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

    return { 
        props: {
            subdomain: id,
            rootUrl: process.env.ROOT_URL,
            publication: JSON.stringify(data),
        },
        revalidate: 10
    }
}