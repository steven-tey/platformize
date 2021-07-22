import prisma from '../../lib/prisma'

export default async function getDrafts(req, res) {
    const { publicationId } = req.query

    const drafts = await prisma.post.findMany({
        where: {
            Publication: {
                id: publicationId
            },
            published: false
        },
        include: {
            pinnedPost: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    const publication = await prisma.publication.findUnique({
        where: {
            id: publicationId
        }
    }) 
    res.status(200).json({drafts, publication})
}