import prisma from '../../lib/prisma'

export default async function Pin(req, res) {
    const { publicationId, postId, slug, pinStatus } = req.query
    if (pinStatus === "true") { // pin post
        await prisma.pinnedPost.update({
            where: {
                publicationId: publicationId
            },
            data: {
                postId: postId
            }
        })
    } else { // unpin post, need to pin the latest post
        const nextPost = await prisma.post.findFirst({
            where: {
                published: true,
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
        if (nextPost) { //if there are still posts left to pin to the top
            await prisma.pinnedPost.update({
                where: {
                    publicationId: publicationId
                },
                data: {
                    postId: nextPost.id
                }
            })
        } else { //if there are no more posts left to pin to the top
            await prisma.pinnedPost.delete({
                where: {
                    publicationId: publicationId
                }
            })
        }
    }
    res.status(200).end()
}