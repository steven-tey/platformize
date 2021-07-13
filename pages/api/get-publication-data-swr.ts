import prisma from '../../lib/prisma'

export default async function getPublicationDataSWR(req, res) {
    const { subdomain } = req.query

    let filter = {
        url: subdomain
    }
    if (subdomain.includes('.')) {
        filter = {
        customDomain: subdomain
        }
    }

    const data = await prisma.publication.findUnique({
        where: filter,
        include: {
            posts: {  
            where: {
                published: true,
            },
            include: {
                pinnedPost: true
            },
            orderBy: [
                {
                createdAt: 'desc',
                }
            ]
            },
        }
    })
    
    res.status(200).json(data)
}