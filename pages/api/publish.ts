import prisma from '../../lib/prisma'

export default async function Publish(req, res) {
    const { publicationId, postId } = req.query
    const post = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            published: true
        }
    })
    const pinnedPost = await prisma.pinnedPost.findUnique({
        where: {
            publicationId: publicationId
        }
    })
    if (!pinnedPost) { // if it's the first post
        await prisma.pinnedPost.create({
            data: {
                publicationId: publicationId,
                postId: postId
            }
        })
    }
    res.status(200).json(post)
}