// pages/drafts.tsx

import {useState} from 'react'
import Layout from '../components/Layout'

export default function Claim ({subdomain, rootUrl}) {

    const [claiming, setClaiming] = useState(false)

  return (
    <Layout
      publicationName={subdomain}
      pageTitle={subdomain}
      description={`${subdomain}.${rootUrl} is available. Claim it now!`}
      logo='/logo.svg'
      unclaimed={true}
    >
      <div className="relative m-auto mt-40 sm:w-1/2 text-center bg-white">
        <h1 className="mt-2 block text-4xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            {subdomain}.{rootUrl}
        </h1>
        <p className="mt-16 text-2xl text-gray-500 leading-8">
            {subdomain}.{rootUrl} is available.
        </p>
        <a
            href="https://app.platformize.co"
            onClick={() => setClaiming(true)}
            className="m-auto px-10 py-3 w-1/2 mt-10 block bg-purple-500 hover:bg-purple-600 rounded-2xl text-white text-2xl font-semibold"
        >
            {claiming?
                "Claiming site..."
                :
                "Claim it now!"
            }
        </a>
      </div>

      <div className="h-350 w-screen"></div>

    </Layout>

  )
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const { req, res } = ctx
  const subdomain = process.env.NODE_ENV === 'production'? req?.headers?.host?.split('.')[0] : process.env.CURR_SLUG

  return {
    props: {
        subdomain: subdomain,
        rootUrl: process.env.ROOT_URL
    },
  }
}