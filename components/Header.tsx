// Header.tsx
import Link from 'next/link'
import React, { Fragment, useState } from 'react'
import { Popover, Transition, Dialog } from '@headlessui/react'
import {
  XIcon,
  ChevronDownIcon
} from '@heroicons/react/outline'
import { MailIcon } from '@heroicons/react/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Header: React.FC = ({name, logo, unclaimed}) => {

  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState(false)

  return (
    <nav>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-10 inset-0 overflow-y-auto"
          open={open}
          onClose={() => setOpen(false)}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-2xl leading-6 font-semibold text-gray-900">
                      Subscribe to {name}
                    </Dialog.Title>
                    <div className="my-5">
                      <p className="text-md text-gray-500">
                        By subscribing, you're consenting to receiving emails from {name}.
                      </p>
                    </div>
                  </div>
                </div>
                <form onSubmit={(event) => {event.preventDefault(); alert(event.target.email.value)}} className="mt-5 sm:mt-6 mx-auto pb-5">
                  <div className="mt-1 inline-block w-full sm:w-7/12 mx-2 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      name="email"
                      required
                      className="border-solid border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm rounded-md"
                      placeholder="you@example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-4/12 mx-2 rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <div 
        className={classNames(
          dropdown ? 'h-72 shadow-2xl' : 'h-20',
          'absolute w-full overflow-hidden border-b bg-white border-gray-200 transition-all ease-in-out duration-300 z-20'
        )}
      >
        <div className="absolute mx-auto left-0 right-0 flex justify-between items-center bg-white z-10 w-10/12 lg:w-1/2 py-5 md:space-x-5">
          <div className="flex justify-start w-0 flex-1">
            <Link href="/"><a>
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
                <button
                  onClick={() => setOpen(true)}
                  className="whitespace-nowrap inline-flex px-2 lg:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm lg:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Subscribe
                </button>
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
          <Link href="/about">
            <a>
              About
            </a>
          </Link>
          <Link href="/archive">
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
                      src={logo}
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
    </nav>
  )
}

export default Header