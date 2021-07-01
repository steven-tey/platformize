import prisma from '../../lib/prisma'

export default async function SaveCustomDomain(req, res) {
    const { domain, oldDomain, publicationId } = req.query
    if (domain != oldDomain ) {
        if (oldDomain.length > 0) {
            await fetch(`https://api.vercel.com/v8/projects/${process.env.VERCEL_PROJECT_ID}/domains/${oldDomain}?teamId=team_nO2mCG4W8IxPIeKoSsqwAxxB`, {
                headers: {
                    Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
                },
                method: "DELETE"
            })
        }
        if (domain.length > 0) {
            await fetch(`https://api.vercel.com/v8/projects/${process.env.VERCEL_PROJECT_ID}/domains?teamId=team_nO2mCG4W8IxPIeKoSsqwAxxB`, {
                body: `{\n  "name": "${domain}"\n}`,
                headers: {
                    Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
                    "Content-Type": "application/json"
                },
                method: "POST"
            })
        }
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