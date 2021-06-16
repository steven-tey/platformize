// pages/p/[id].tsx

import React from 'react'
import { GetServerSideProps } from 'next'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
import Router from 'next/router'
import { PostProps } from '../../components/Post'
import prisma from '../../lib/prisma'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  
  const { slug } = ctx.query;

  const post = await prisma.post.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      title: true,
      content: true
    }
  })

  return {
    props: {
      post
    },
  }
}

async function publishPost(id: number): Promise<void> {
  await fetch(`http://localhost:3000/api/publish/${id}`, {
    method: 'PUT',
  })
  await Router.push('/')
}
async function deletePost(id: number): Promise<void> {
  await fetch(`http://localhost:3000/api/post/${id}`, {
    method: 'DELETE',
  })
  Router.push('/')
}

const Post: React.FC<PostProps> = (props) => {

  const post = props.post  
  const userHasValidSession = true
  const postBelongsToUser = true

  return (
    <Layout>
      <div>
        <h2>{post.title}</h2>
        <p>By Steven Tey</p>
        <ReactMarkdown source={post.content} />
        {
          !post.published && userHasValidSession && postBelongsToUser && (
            <button onClick={() => publishPost(post.id)}>Publish</button>
          )
        }
        {
          userHasValidSession && postBelongsToUser && (
            <button onClick={() => deletePost(post.id)}>Delete</button>
          )
        }
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default Post