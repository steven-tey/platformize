// pages/p/[id].tsx

import React from 'react'
import Layout from '../../../components/Layout'
import PageLoader from "../../../components/PageLoader"
import { useRouter } from "next/router"
import Image from 'next/image'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import prisma from '../../../lib/prisma'

export default function PostPage (props) {

    const { isFallback } = useRouter();
        
    if (isFallback) {
        return <PageLoader/>
    }

    let post = JSON.parse(props.post)
    if (!post) {
        post = {}
        post.title = "Post Not Found"
        post.description = "Check the URL, there's something fishy going on there..."
        post.logo = "https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
        post.content = ''
        post.image = '/empty-state.webp'
    }

    return (
        <Layout
            publicationName={props.publication.name}
            pageTitle={post.title}
            description={post.description}
            logo={props.publication.logo}
        >
        <div className="relative m-auto mt-20 sm:w-1/2 text-center bg-white overflow-hidden">
            <h1 className="mt-2 block text-4xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                {post.title}
            </h1>
            <p className="mt-16 text-2xl text-gray-500 leading-8">
            {post.description}
            </p>
        </div>
        <div className="w-full sm:w-8/12 mx-auto mt-16 overflow-hidden sm:rounded-lg shadow-2xl">
            <Image
            width={2048}
            height={1170}
            layout="responsive"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2PYsGHDfwAHNAMQumvbogAAAABJRU5ErkJggg=="
            src={post.image}
            />
        </div>

        <div 
            dangerouslySetInnerHTML={{ __html: post.content }} 
            className="m-auto mt-20 mb-48 w-10/12 text-lg sm:w-1/2 sm:text-2xl sm:leading-relaxed text-gray-800 leading-relaxed space-y-6"
        />

        </Layout>
    )
}

export async function getStaticPaths() {
    const posts = await prisma.post.findMany({
        where: {
            published: true,
        },
        select: {
            publicationUrl: true,
            slug: true,
            Publication: {
                select: {
                    customDomain: true
                }
            }
        }
    })
    return {
        paths: posts.flatMap((post) => {
            if (post.Publication?.customDomain) {
                return  [{ params: { id: post.Publication.customDomain, slug: post.slug } }, {params: { id: post.publicationUrl, slug: post.slug }}]
            } else {
                return  { params: { id: post.publicationUrl, slug: post.slug } }
            }
        }),
        fallback: true
    }
}

export async function getStaticProps({params: {id, slug}}) {

    let filter = {
        url: id
    }
    let constraint = {
        publicationUrl: id,
        slug: slug,
    }
    if (id.includes('.')) {
        filter = {
            customDomain: id
        }
        const correspondingUrl = await prisma.publication.findUnique({
            where: {
                customDomain: id
            },
            select: {
                url: true
            }
        })
        constraint = {
            publicationUrl: correspondingUrl?.url,
            slug: slug,
        }
    }
    
    const publication = await prisma.publication.findUnique({
        where: filter,
        select: {
            name: true,
            description: true,
            logo: true,
            url: true
        }
    })
    const post = await prisma.post.findUnique({
        where: {
            slug_publication_constraint: constraint
        }
    })
    const matterResult = post ? matter(post?.content) : ''

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
        props: {
            publication: publication,
            post: JSON.stringify(post),
            content: contentHtml,
        },
        revalidate: 10
    }
}