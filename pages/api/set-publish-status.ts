import prisma from '../../lib/prisma'

export default async function setPublishStatus(req, res) {
    const { postId, slug, publishStatus } = req.query
    const data = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            published: publishStatus === "true"
        },
        include: {
            pinnedPost: true
        }
    })
    if (data.pinnedPost.length > 0) {
        const nextPost = await prisma.post.findFirst({
            where: {
                publicationUrl: slug,
                NOT: {
                    id: postId
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true
            }
        })
        await prisma.pinnedPost.update({
            where: {
                postId: postId
            },
            data: {
                postId: nextPost.id
            }
        })
    }
    res.status(200).end()
}