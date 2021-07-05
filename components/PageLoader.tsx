export default function PageLoader() {
    return (
        <>
        <div className="relative m-auto mt-20 sm:w-1/2 text-center bg-white overflow-hidden">
            <div 
                className="w-2/3 mx-auto my-8 h-20 animate-pulse bg-gray-300 rounded-md"
            />
            <div 
                className="w-1/2 mx-auto my-2.5 h-8 animate-pulse bg-gray-300 rounded-md"
            />
            <div 
                className="w-1/2 mx-auto my-2.5 h-8 animate-pulse bg-gray-300 rounded-md"
            />
        </div>
        <div 
            className="w-8/12 mx-auto my-10 h-700 animate-pulse bg-gray-300 rounded-lg"
        />
        </>
    )
}