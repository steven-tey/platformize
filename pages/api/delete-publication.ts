import prisma from '../../lib/prisma'

export default async function DeletePublication(req, res) {
    const { publicationId } = req.query
    await prisma.publicationUser.deleteMany({
        where: {
            publicationId: publicationId
        }
    })
    await prisma.publication.delete({
        where: {
            id: publicationId
        }
    })
    res.status(200).end()
}