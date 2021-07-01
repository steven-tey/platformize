import prisma from '../../lib/prisma'

export default async function SavePublicationName(req, res) {
    const { name, publicationId } = req.query
    await prisma.publication.update({
        where: {
            id: publicationId
        },
        data: {
            name: name
        }
    })
    res.status(200).end()
}