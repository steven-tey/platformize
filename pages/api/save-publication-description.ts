import prisma from '../../lib/prisma'

export default async function SavePublicationDescription(req, res) {
    const { description, publicationId } = req.query
    await prisma.publication.update({
        where: {
            id: publicationId
        },
        data: {
            description: description
        }
    })
    res.status(200).end()
}