// Header.tsx
import Link from 'next/link'
import React, { useState } from 'react'
import {
  ChevronDownIcon
} from '@heroicons/react/outline'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Header: React.FC = ({name, url, logo, unclaimed}) => {

  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState(false)

  return (
    <nav>
      <div 
        className={classNames(
          dropdown ? 'h-64 shadow-2xl' : 'h-20',
          'absolute w-full overflow-hidden border-b bg-white border-gray-200 transition-all ease-in-out duration-300 z-20'
        )}
      >
        <div className="absolute mx-auto left-0 right-0 flex justify-between items-center bg-white z-10 w-10/12 lg:w-1/2 py-5 md:space-x-5">
          <div className="flex justify-start w-0 flex-1">
            <Link href={`/`}><a>
              <img
                className="h-8 w-auto sm:h-10 inline-block"
                src={logo}
                alt=""
              />
              <span className="inline-block ml-3 text-md overflow-wrap w-7/12 lg:w-auto lg:text-lg text-gray-700 align-middle">{name}</span>
            </a></Link>
          </div>
          {
            !unclaimed 
            ? <>
              <div className="flex items-center justify-end space-x-3">
                <Link href={`/subscribe`}>
                <a
                  className="whitespace-nowrap inline-flex px-2 lg:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm lg:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Subscribe
                </a></Link>
                <button
                  onClick={() => setDropdown(!dropdown)}
                >
                  <ChevronDownIcon
                    className={classNames(
                      dropdown ? 'text-gray-600 transform rotate-180' : 'text-gray-400',
                      'h-8 w-8 group-hover:text-gray-500 transition-all ease duration-200 inline-block align-middle'
                    )}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </> : null
          }
        </div>
        <div
          className={classNames(
            dropdown ? 'translate-y-0' : '-translate-y-48',
            'flex flex-col items-end space-y-5 text-lg text-gray-800 absolute mx-auto left-0 right-0 top-24 w-10/12 sm:w-1/2 transform transition-all ease-in-out duration-300'
          )}
        >
          <Link href={`/about`}>
            <a>
              About
            </a>
          </Link>
          <Link href={`/about`}>
            <a>
              Archive
            </a>
          </Link>
          <Link href="#">
            <a>
              My Account
            </a>
          </Link>
        </div>
      </div>
      <div 
        onClick={() => setDropdown(false)}
        className={classNames(
          dropdown ? 'bg-black bg-opacity-40' : 'z-0',
          'absolute w-screen h-screen transition-all ease-in-out duration-300 z-10'
        )}
      />
    </nav>
  )
}

export default Header