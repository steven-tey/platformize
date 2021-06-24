import prisma from '../../lib/prisma'

export default async function CreatePublication(req, res) {
    const { name, url, description, userId } = req.query
    const response = await prisma.publication.create({
        data: {
            name: name,
            description: description.length > 0 ? description : "The hottest gossip about armadilos",
            url: url, 
        }
    })
    await prisma.publicationUser.create({
        data: {
            publicationId: response.id,
            userId: userId,
            role: "Owner",
        }
    })
    res.status(200).json({publicationId: response.id})
}