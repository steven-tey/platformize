// Header.tsx
import Link from 'next/link'
import React, { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
  XIcon,
  ChevronDownIcon
} from '@heroicons/react/outline'

const dropdown = [
  {
    name: 'About',
    href: '/about',
  },
  {
    name: 'Archive',
    href: '/archive',
  },
  {
    name: 'Help',
    href: '#',
  },
  { name: 'My Account', href: '#' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Header: React.FC = ({title}) => {

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
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt=""
                  />
                  <span className="inline-block ml-3 text-lg text-gray-700 align-middle">{title}</span>
                </a></Link>
              </div>
              <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                <Link href="/subscribe"><a
                  className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Subscribe
                </a></Link>
              </div>

              <Popover.Group as="nav" className="hidden md:flex">
                <Popover className="relative">
                  {({ open }) => (
                    <>
                      <Popover.Button className="focus:outline-none md:-ml-3">
                        <ChevronDownIcon
                          className={classNames(
                            open ? 'text-gray-600 transform rotate-180' : 'text-gray-400',
                            'h-8 w-8 group-hover:text-gray-500 transition-all ease duration-200 inline-block align-middle'
                          )}
                          aria-hidden="true"
                        />
                      </Popover.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel
                          static
                          className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-sm sm:px-0"
                        >
                          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                            <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                              {dropdown.map((item) => (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                ><a className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50">
                                  <div className="ml-4">
                                    <p className="text-base font-medium text-gray-900">{item.name}</p>
                                  </div>
                                </a></Link>
                              ))}
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              </Popover.Group>
            </div>
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              focus
              static
              className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
            >
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                <div className="pt-5 pb-6 px-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                        alt="Workflow"
                      />
                    </div>
                    <div className="-mr-2">
                      <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="sr-only">Close menu</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>
                  </div>
                </div>
                <div className="py-6 px-5 space-y-6">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    {dropdown.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="text-base font-medium text-gray-900 hover:text-gray-700"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div>
                    <a
                      href="#"
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Subscribe
                    </a>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>

    </nav>
  )
}

export default Header