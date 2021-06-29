import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React from 'react'
import { Popover } from '@headlessui/react'
import { signOut } from 'next-auth/client'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AppLayout ({name, email, image, children}) {
    const title = 'Platformize App'
    const description = 'Platformize is a NextJS framework that allows you to crate Substack-like user experiences out of the box.'
    const logo = 'https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
    const router = useRouter()
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
      <Popover className="relative bg-white">
        {({ open }) => (
          <>
            <div className="max-w border-b border-gray-500">
              <div className="flex justify-between items-center mx-auto w-10/12 sm:w-1/2 py-5 sm:px-6 md:justify-start md:space-x-10">
                <div className="flex justify-start lg:w-0 lg:flex-1">
                  <Link href="/"><a>
                    <span className="sr-only">Workflow</span>
                    <img
                      className="h-8 w-auto sm:h-10 inline-block rounded-full"
                      src={image}
                      alt=""
                    />
                    <span className="inline-block ml-3 text-lg text-gray-700 align-middle truncate">{name}</span>
                  </a></Link>
                </div>
                <div className="hidden md:flex items-center space-x-10 justify-end md:flex-1 lg:w-0">
                  <Link href="/">
                      <a className={classNames(
                          router.pathname == '/' || router.pathname.split('/')[1] == 'publication' ? 'text-indigo-600' : '',
                          'text-base font-medium text-gray-700 hover:text-indigo-600'
                          )}>
                          Publications
                      </a>
                  </Link>
                  <Link href="/account">
                      <a className={classNames(
                          router.pathname == '/account' ? 'text-indigo-600' : '',
                          'text-base font-medium text-gray-700 hover:text-indigo-600'
                          )}>
                          Account
                      </a>
                  </Link>  
                  <button
                      onClick={() => signOut()}
                      className="focus:outline-none text-base font-medium text-gray-700 hover:text-indigo-600"
                  >
                      Logout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </Popover>
      {children}
    </div>
    </>
  )
}