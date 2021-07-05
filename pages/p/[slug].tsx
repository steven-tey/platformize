// pages/p/[id].tsx

import React from 'react'
import Layout from '../../components/Layout'
import Post from '../../components/Post'

export default function PostPage (props) {

  return (
    <Layout
      subdomain={props.subdomain}
      customDomain={props.customDomain}
    >
      <Post 
        subdomain={props.subdomain}
        customDomain={props.customDomain}
        slug={props.slug}
        postData={props.postData}
      />

    </Layout>
  )
}

const fetcher = (...args) => fetch(...args).then(res => res.json())

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

  let customDomain = domain
  if (domain.substr(domain.indexOf('.')+1) == process.env.ROOT_URL) {
    customDomain = 'no custom domain'
  }

  const baseURL =  process.env.NODE_ENV != 'production' ? 'http://localhost:3000' : customDomain == 'no custom domain' ? `${subdomain}.${process.env.ROOT_URL}` : customDomain

  const postData = await fetcher(`${baseURL}/api/fetch-post?subdomain=${encodeURIComponent(subdomain)}&customDomain=${encodeURIComponent(customDomain)}&slug=${encodeURIComponent(slug)}`)

  return {
    props: {
      subdomain: subdomain,
      customDomain: customDomain,
      slug: slug,
      postData: postData
    },
  }
}