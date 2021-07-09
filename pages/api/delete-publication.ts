import prisma from '../../lib/prisma'

export default async function DeletePublication(req, res) {
    const { publicationId } = req.query
    await prisma.publicationUser.deleteMany({
        where: {
            publicationId: publicationId
        }
    })
    try {
        await prisma.pinnedPost.delete({
            where: {
                publicationId: publicationId
            }
        })
    } catch {
        console.log('no pinned post to delete!')
    }
    try {
        await prisma.post.deleteMany({
            where: {
                Publication: {
                    id: publicationId
                }
            }
        })
    } catch {
        console.log('no posts to delete!')
    }
    await prisma.publication.delete({
        where: {
            id: publicationId
        }
    })
    res.status(200).end()
}