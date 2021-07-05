import prisma from '../../lib/prisma'

export default async function fetchPublicationDetails(req, res) {
    const { subdomain, customDomain } = req.query

    let constraint = {
        url: subdomain,
    }

    if (customDomain != 'no custom domain') {
        constraint = {
           customDomain: customDomain
        }
    }

    const data = await prisma.publication.findUnique({
        where: constraint
    })

    res.status(200).json({
        name: data?.name,
        description: data?.description,
        logo: data?.logo,
    })
}