import prisma from '../../lib/prisma'

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

export default async function Publish(req, res) {
    const { publicationId, postId } = req.query
    const postData = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })
    const post = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            published: true,
            image: `https://og-image.vercel.app/${encodeURIComponent(postData.title)}.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-white.svg`,
            slug: `${postData.title.replace(/[.,\/'"?'#!$%@\^&\*;:{}=\-_`~()]/g,"").replace(/\s+/g, '-').toLowerCase()}-${makeid(8)}`
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