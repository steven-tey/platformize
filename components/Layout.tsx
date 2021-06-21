import Head from 'next/head'
import Header from './Header'

export default function Layout ({title, description, thumbnail, children}) {
  return (
    <>
    <div>  
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/logo.svg" />
        <link rel="shortcut icon" type="image/x-icon" href={thumbnail}/>
        <link rel="apple-touch-icon" sizes="180x180" href={thumbnail}/>
        <meta name="theme-color" content="#7b46f6"/>

        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>

        <meta itemprop="name" content={title}/>
        <meta itemprop="description" content={description}/>
        <meta itemprop="image" content={thumbnail}/>
        <meta name="description" content={description}/>
        <meta property="og:title" content={title}/>
        <meta property="og:description" content={description}/>
        <meta property="og:image" content={thumbnail}/>
        <meta property="og:type" content="website"/>

        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:site" content="@Elegance" />
        <meta name="twitter:creator" content="@StevenTey"/>
        <meta name="twitter:title" content={title}/>
        <meta name="twitter:description" content={description}/>
        <meta name="twitter:image" content={thumbnail}/>
      </Head>
      <Header title={title}/>
      {children}
    </div>
    </>
  )
}