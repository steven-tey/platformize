// Header.tsx
import Link from 'next/link'
import {useRouter} from 'next/router'
import React from 'react'
import { Popover } from '@headlessui/react'
import { signOut } from 'next-auth/client'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const AppHeader: React.FC = ({name, email, logo}) => {

  const router = useRouter()

  return (
    <nav>
      <Popover className="relative bg-white">
      {({ open }) => (
        <>
          <div className="max-w border-b border-gray-500">
            <div className="flex justify-between items-center mx-auto w-10/12 sm:w-1/2 py-5 sm:px-6 md:justify-start md:space-x-10">
              <div className="flex justify-start lg:w-0 lg:flex-1">
                <Link href="/"><a>
                  <span className="sr-only">Workflow</span>
                  <img
                    className="h-8 w-auto sm:h-10 inline-block"
                    src={logo}
                    alt=""
                  />
                  <span className="inline-block ml-3 text-lg text-gray-700 align-middle truncate">{name}</span>
                </a></Link>
              </div>
              <div className="hidden md:flex items-center space-x-10 justify-end md:flex-1 lg:w-0">
                <Link href="/">
                    <a className={classNames(
                        router.pathname == '/' ? 'text-indigo-600' : '',
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

    </nav>
  )
}

export default AppHeader