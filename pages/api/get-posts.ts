import prisma from '../../lib/prisma'

export default async function getPosts(req, res) {
    const { publicationId } = req.query
    const posts = await prisma.post.findMany({
        where: {
            Publication: {
                id: publicationId
            },
            published: true
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
    res.status(200).json({posts, publication})
}