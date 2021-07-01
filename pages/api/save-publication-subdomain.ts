import prisma from '../../lib/prisma'

export default async function SavePublicationSubdomain(req, res) {
    const { subdomain, publicationId } = req.query
    await prisma.publication.update({
        where: {
            id: publicationId
        },
        data: {
            url: subdomain
        }
    })
    res.status(200).end()
}