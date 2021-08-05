import AppLayout from '../../../../components/AppLayout'
import Link from 'next/link'
import Image from 'next/image'
import useSWR, {mutate} from 'swr'
import { useState } from 'react'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Settings ({publicationId, rootUrl}) {

    const [subdomainError, setSubdomainError] = useState(false)

    const { data } = useSWR(`/api/get-publication-data?publicationId=${publicationId}`, fetcher, {initialData: {
        name: '',
        url: '',
        customDomain: '',
        description: ''
    }, revalidateOnMount: true})

    return (
        <AppLayout>
        <>
            {/* Mobile Navigation Menu */}
            <div className="sm:hidden flex justfiy-between w-11/12 mx-auto mt-5 text-center">
                <Link href="/">
                    <a className="mx-8 font-semibold text-2xl">
                        ←
                    </a>
                </Link>
                <a href={`https://${data?.url}.${rootUrl}`} target="_blank"
                    className="flex align-middle"
                >
                    <div className="inline-block mx-auto w-10 h-auto rounded-xl overflow-hidden">
                        <Image 
                            width={80}
                            height={80}
                            src='/logo.svg'
                        />
                    </div>
                    <p className="inline-block font-medium text-lg mt-2 mx-3">{data.name}</p>
                </a>
            </div>
            <div className="sm:hidden flex justfiy-between w-11/12 mx-auto mt-5 space-x-2 text-center pb-5">
                <Link href={`/publication/${publicationId}/`}>
                    <a className="font-semibold text-gray-900 hover:bg-gray-300 rounded-md w-full px-2 py-2 text-lg">
                        Posts
                    </a>
                </Link>
                <Link href={`/publication/${publicationId}/drafts`}>
                    <a className="font-semibold text-gray-900 hover:bg-gray-300 rounded-md w-full px-2 py-2 text-lg">
                        Drafts
                    </a>
                </Link>
                <Link href={`/publication/${publicationId}/settings`}>
                    <a className="font-semibold text-gray-900 bg-gray-300 rounded-md w-full px-2 py-2 text-lg">
                        Settings
                    </a>
                </Link>
            </div>
            <div className="sm:hidden w-full border-t mt-3 -mb-5 border-gray-200" />

            {/* Desktop Navigation Menu */}
            <div className="w-11/12 sm:w-7/12 mx-auto grid grid-cols-4 gap-10 h-screen sm:divide-x">
                <div className="pt-10 hidden sm:block sm:col-span-1">
                    <Link href="/">
                        <a className="text-left font-semibold text-lg">
                            ← All Publications 
                        </a>
                    </Link>
                    <a href={`https://${data?.url}.${rootUrl}`} target="_blank">
                        <div className="relative mx-auto mt-5 mb-3 w-16 h-auto rounded-xl overflow-hidden">
                            <Image 
                                width={80}
                                height={80}
                                src='/logo.svg'
                            />
                        </div>
                        <p className="text-center font-medium">{data.name}</p>
                    </a>

                    <div className="text-left grid grid-cols-1 gap-6 mt-10">
                        <Link href={`/publication/${publicationId}`}>
                            <a className="font-semibold text-gray-900 hover:bg-gray-300 rounded-md w-full px-2 py-2 text-lg">
                                Posts
                            </a>
                        </Link>
                        <Link href={`/publication/${publicationId}/drafts`}>
                            <a className="font-semibold text-gray-900 hover:bg-gray-300 rounded-md w-full px-2 py-2 text-lg">
                                Drafts
                            </a>
                        </Link>
                        <Link href={`/publication/${publicationId}/settings`}>
                            <a className="font-semibold text-gray-900 bg-gray-300 rounded-md w-full px-2 py-2 text-lg">
                                Settings
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="pt-16 sm:pl-10 col-span-4 sm:col-span-3">
                    <div className="flex justify-between">
                        <h1 className="font-bold text-2xl sm:text-3xl sm:m-5 mb-10">
                            Settings
                        </h1>
                    </div>
                    <form
                        onSubmit={async (e) => {
                            e.target.submit.innerHTML = 'Saving...'
                            e.persist()
                            e.preventDefault()
                            mutate(`/api/get-publication-data?publicationId=${publicationId}`, { ...data, name: e.target.name.value }, false)
                            await fetch(`/api/save-publication-name?name=${e.target.name.value}&publicationId=${publicationId}`)
                            mutate(`/api/get-publication-data?publicationId=${publicationId}`)
                            e.target.submit.innerHTML = 'Save';
                        }}
                        className="sm:gap-4 sm:items-start sm:border-b sm:border-gray-200 py-5 mb-5"
                    >
                        <div className="sm:grid sm:grid-cols-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Name
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-3">
                                <input
                                type="text"
                                name="name"
                                autoComplete="off"
                                required
                                defaultValue={data.name}
                                className="rounded-md border border-solid border-gray-300  w-full focus:outline-none min-w-0 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="w-full flex justify-end mt-3">
                            <button 
                                type="submit"
                                name="submit"
                                className="my-2 py-2 px-8 text-md bg-indigo-600 text-white border-solid border border-indigo-600 rounded-lg hover:text-indigo-600 hover:bg-white focus:outline-none transition-all ease-in-out duration-150"
                            >
                                Save
                            </button>
                        </div>
                    </form>

                    <form 
                        onSubmit={async (e) => {
                            setSubdomainError(false)
                            e.target.submit.innerHTML = 'Saving...'
                            e.persist()
                            e.preventDefault()
                            mutate(`/api/get-publication-data?publicationId=${publicationId}`, { ...data, url: e.target.subdomain.value }, false)
                            await fetch(`/api/save-publication-subdomain?subdomain=${e.target.subdomain.value}&publicationId=${publicationId}`).then((res) => {
                                if (!res.ok) {
                                    setSubdomainError(true)
                                }
                            })
                            mutate(`/api/get-publication-data?publicationId=${publicationId}`)
                            e.target.submit.innerHTML = 'Save';
                        }}
                        className="sm:gap-4 sm:items-start sm:border-b sm:border-gray-200 py-5 mb-5"
                    >
                        <div className="sm:grid sm:grid-cols-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Subdomain
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-3">
                                <div className="max-w-lg flex rounded-md shadow-sm border border-solid border-gray-300">
                                    <input
                                    type="text"
                                    name="subdomain"
                                    autoComplete="off"
                                    required
                                    defaultValue={data?.url}
                                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none border rounded-l-md sm:text-sm border-gray-300"
                                    />
                                    <span className="inline-flex items-center px-3 w-1/2 rounded-r-md border-t-0 border-r-0 border-b-0 border border-l-1 border-gray-300 bg-gray-100 text-gray-600 sm:text-sm">
                                    .{rootUrl}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={`w-full flex ${subdomainError ? "justify-between" : "justify-end"} mt-3`}>
                        {subdomainError && <p className="text-sm text-red-600 mt-5">This subdomain is taken. Please choose another one.</p>}
                            <button 
                                type="submit"
                                name="submit"
                                className="my-2 py-2 px-8 text-md bg-indigo-600 text-white border-solid border border-indigo-600 rounded-lg hover:text-indigo-600 hover:bg-white focus:outline-none transition-all ease-in-out duration-150"
                            >
                                Save
                            </button>
                        </div>
                    </form>

                    <form
                        onSubmit={async (e) => {
                            e.target.submit.innerHTML = 'Saving...'
                            e.persist()
                            e.preventDefault()
                            const oldDomain = data.customDomain
                            mutate(`/api/get-publication-data?publicationId=${publicationId}`, { ...data, customDomain: e.target.customDomain.value }, false)
                            await fetch(`/api/save-custom-domain?domain=${e.target.customDomain.value}&oldDomain=${oldDomain}&publicationId=${publicationId}`)
                            mutate(`/api/get-publication-data?publicationId=${publicationId}`)
                            e.target.submit.innerHTML = 'Save'
                        }}
                        className="sm:gap-4 sm:items-start sm:border-b sm:border-gray-200 py-5 mb-5"
                    >
                        <div className="sm:grid sm:grid-cols-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Custom domain
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-3">
                            <div className="max-w-lg flex rounded-md shadow-sm border border-solid border-gray-300">
                                <input
                                type="text"
                                name="customDomain"
                                autoComplete="off"
                                defaultValue={data.customDomain}
                                placeholder="mydomain.com"
                                className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 border rounded-md sm:text-sm border-gray-300"
                                />
                            </div>
                            </div>
                        </div>
                        <div className="w-full flex justify-between mt-3">
                            <p className="text-sm text-indigo-600 mt-5">Note: This can take anywhere between 5-10 minutes to take effect.</p>
                            <button 
                                type="submit"
                                name="submit"
                                className="my-2 py-2 px-8 text-md bg-indigo-600 text-white border-solid border border-indigo-600 rounded-lg hover:text-indigo-600 hover:bg-white focus:outline-none transition-all ease-in-out duration-150"
                            >
                                Save
                            </button>
                        </div>
                    </form>


                    <form
                        onSubmit={async (e) => {
                            e.target.submit.innerHTML = 'Saving...'
                            e.persist()
                            e.preventDefault()
                            await fetch(`/api/save-publication-description?description=${e.target.description.value}&publicationId=${publicationId}`)
                            e.target.submit.innerHTML = 'Save'
                        }}
                        className="sm:gap-4 sm:items-start sm:border-gray-200 py-5 mb-5"
                    >
                        <div className="sm:grid sm:grid-cols-4">
                            <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                            Description
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-3">
                                <textarea
                                    name="description"
                                    rows={3}
                                    defaultValue={data.description}
                                    placeholder="The hottest gossip about armadilos"
                                    className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div className="w-full flex justify-end mt-3">
                            <button 
                                type="submit"
                                name="submit"
                                className="my-2 py-2 px-8 text-md bg-indigo-600 text-white border-solid border border-indigo-600 rounded-lg hover:text-indigo-600 hover:bg-white focus:outline-none transition-all ease-in-out duration-150"
                            >
                                Save
                            </button>
                        </div>    
                    </form> 
                </div>
            </div>
        </>
        </AppLayout>
    )
}

export async function getServerSideProps(ctx) {

    const { id } = ctx.query;  
    return {
        props: {
            publicationId: id,
            rootUrl: process.env.ROOT_URL
        }
    }
}