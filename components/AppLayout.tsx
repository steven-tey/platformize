import Head from 'next/head'
import AppHeader from './AppHeader'

export default function AppLayout ({name, email, image, children}) {
    const title = 'Platformize App'
    const description = 'Platformize is a NextJS framework that allows you to crate Substack-like user experiences out of the box.'
    const logo = 'https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
  return (
    <>
    <div>  
      <Head>
        <title>{title}</title>
        <link rel="icon" href={logo} />
        <link rel="shortcut icon" type="image/x-icon" href={logo}/>
        <link rel="apple-touch-icon" sizes="180x180" href={logo}/>
        <meta name="theme-color" content="#7b46f6"/>

        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>

        <meta itemprop="name" content={title}/>
        <meta itemprop="description" content={description}/>
        <meta itemprop="image" content={logo}/>
        <meta name="description" content={description}/>
        <meta property="og:title" content={title}/>
        <meta property="og:description" content={description}/>
        <meta property="og:image" content={logo}/>
        <meta property="og:type" content="website"/>

        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:site" content="@Elegance" />
        <meta name="twitter:creator" content="@StevenTey"/>
        <meta name="twitter:title" content={title}/>
        <meta name="twitter:description" content={description}/>
        <meta name="twitter:image" content={logo}/>
      </Head>
      <AppHeader 
        name={name}
        email={email}
        image={image}
      />
      {children}
    </div>
    </>
  )
}