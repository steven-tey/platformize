import prisma from '../../lib/prisma'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import { getPlaiceholder } from "plaiceholder";

const plaiceholder = async (path) => {
    try {
      const base64 = await getPlaiceholder(path)
      return base64
    } catch (err) {
      err;
    }
}  

export default async function fetchPost(req, res) {
    const { subdomain, customDomain, slug } = req.query

    let constraint = {
        publicationUrl: subdomain,
        slug: slug,
    }

    if (customDomain != 'no custom domain') {
        constraint = {
            publicationUrl: (await prisma.publication.findUnique({
            where:{
                customDomain: customDomain
            },
            select: {
                url: true
            }
            }))?.url,
            slug: slug,
        }
    }

    const post = await prisma.post.findUnique({
        where: {
          slug_publication_constraint: constraint,
        },
        include: {
          Publication: {
            select: {
              name: true,
              description: true,
              logo: true
            }
          }
        }
    })

    post.placeholder = await plaiceholder(post?.image)
    
    const matterResult = matter(post?.content)

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString()
    
    res.status(200).json({
        publicationName: post?.Publication.name,
        postTitle: post?.title,
        description: post?.description,
        logo: post?.Publication.logo,
        thumbnail: post?.image,
        placeholder: post.placeholder,
        content: contentHtml,
    })
}