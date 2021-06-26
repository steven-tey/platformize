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

export default async function Save(req, res) {
    const data = JSON.parse(req.body)
    const randomString = makeid(5)
    const response = await prisma.post.update({
        where: {
            id: data.id
        },
        data: {
            title: data.title,
            description: data.description,
            content: data.content,
            slug: `${data.title.replace(/[.,\/'"?'#!$%@\^&\*;:{}=\-_`~()]/g,"").replace(/\s+/g, '-').toLowerCase()}-${randomString}`
        }
    })
    
    res.status(200).json(response)
}