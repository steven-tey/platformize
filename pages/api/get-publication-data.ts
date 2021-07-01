import prisma from '../../lib/prisma'

export default async function getPublicationData(req, res) {
    const { publicationId } = req.query
    const data = await prisma.publication.findUnique({
        where: {
            id: publicationId
        }
    })
    res.status(200).json(data)
}