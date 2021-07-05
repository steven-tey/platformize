import Head from 'next/head'
import Header from './Header'
import useSWR from 'swr'
import Loader from './Loader'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Layout ({subdomain, customDomain, children, unclaimed}) {

  const {data, error} = useSWR(`/api/fetch-publication-details?subdomain=${encodeURIComponent(subdomain)}&customDomain=${encodeURIComponent(customDomain)}`, fetcher)
  if (!data) return <Loader/>
    
  return (
    <>
    <div>  
      <Head>
        <title>{data.name}</title>
        <link rel="icon" href={data.logo} />
        <link rel="shortcut icon" type="image/x-icon" href={data.logo}/>
        <link rel="apple-touch-icon" sizes="180x180" href={data.logo}/>
        <meta name="theme-color" content="#7b46f6"/>

        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>

        <meta itemprop="name" content={data.name}/>
        <meta itemprop="description" content={data.description}/>
        <meta itemprop="image" content={data.logo}/>
        <meta name="description" content={data.description}/>
        <meta property="og:title" content={data.name}/>
        <meta property="og:description" content={data.description}/>
        <meta property="og:image" content={data.logo}/>
        <meta property="og:type" content="website"/>

        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:site" content="@Elegance" />
        <meta name="twitter:creator" content="@StevenTey"/>
        <meta name="twitter:title" content={data.name}/>
        <meta name="twitter:description" content={data.description}/>
        <meta name="twitter:image" content={data.logo}/>
      </Head>
      <Header 
        name={data.name}
        logo={data.logo}
        unclaimed={unclaimed}
      />
      <div className="pt-20">
        {children}
      </div>
    </div>
    </>
  )
}