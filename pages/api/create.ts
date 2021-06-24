import prisma from '../../lib/prisma'

export default async function CreatePost(req, res) {
    const { publicationUrl } = req.query
    const response = await prisma.post.create({
        data: {
            publicationUrl: publicationUrl
        }
    })
    res.status(200).json({postId: response.id})
}