import prisma from '../../lib/prisma'

export default async function AddCustomDomain(req, res) {
    const { domain, publicationId } = req.query
    const response = await fetch(`https://api.vercel.com/v8/projects/${process.env.VERCEL_PROJECT_ID}/domains`, {
        body: `{\n  "name": "${domain}"\n}`,
        headers: {
            Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
            "Content-Type": "application/json"
        },
        method: "POST"
    })
    if (response.ok) {
        await prisma.publication.update({
            where: {
                id: publicationId
            },
            data: {
                customDomain: domain
            }
        })
    }
    res.status(200).end()
}