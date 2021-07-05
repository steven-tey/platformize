import Image from 'next/image'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Post (props) {

    const { data, error } = useSWR(`/api/fetch-post?subdomain=${encodeURIComponent(props.subdomain)}&customDomain=${encodeURIComponent(props.customDomain)}&slug=${encodeURIComponent(props.slug)}`, fetcher)

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

    return (
        <>
            <div className="relative m-auto mt-20 sm:w-1/2 text-center bg-white overflow-hidden">
                <h1 className="mt-2 block text-4xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                    {data.postTitle}
                </h1>
                <p className="mt-16 text-2xl text-gray-500 leading-8">
                {data.description}
                </p>
            </div>
            <div className="w-full sm:w-8/12 mx-auto mt-16 overflow-hidden sm:rounded-lg shadow-2xl">
                <Image
                width={2048}
                height={1170}
                layout="responsive"
                placeholder="blur"
                blurDataURL={data.placeholder}
                src={data.thumbnail}
                />
            </div>

            <div 
                dangerouslySetInnerHTML={{ __html: data.content }} 
                className="m-auto mt-20 mb-48 w-10/12 text-lg sm:w-1/2 sm:text-2xl sm:leading-relaxed text-gray-800 leading-relaxed space-y-6"
            />
        </>
    )
}
  