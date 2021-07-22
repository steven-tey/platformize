import prisma from '../../lib/prisma'

export default async function getPublications(req, res) {
    const { sessionId } = req.query
    const publications = await prisma.publication.findMany({
        where: {
            users: {
                some: {
                    userId: sessionId
                }
            }
        }
    })
    res.status(200).json({publications})
}
