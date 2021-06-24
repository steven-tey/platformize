import prisma from '../../lib/prisma'

export default async function Delete(req, res) {
    const { publicationId, postId, slug, draft } = req.query
    if (draft === "true") {
        await prisma.post.delete({
            where: {
                id: postId
            }
        })
        res.status(200).end()
    }
    const data = await prisma.pinnedPost.findUnique({
        where: {
            publicationId: publicationId
        }
    })
    if (data.postId == postId) { // if it's a pinned post
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
        await prisma.post.delete({
            where: {
                id: postId
            }
        })
    } else {
        await prisma.post.delete({
            where: {
                id: postId
            }
        })
    }
    res.status(200).end()
}