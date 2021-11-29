import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const hostname = req.headers.get('host') // retreat.staging.platformize.co

    // regex for vercel.app wildcards: (\.)?([\w-]+).vercel.app
    const regex = /((\.)?([\w-]+).vercel.app|(\.)?platformize.co|(\.)?staging.platformize.co)/

    const currentHost = process.env.VERCEL === '1' ? hostname.replace(regex, '') : hostname.replace(`.localhost:3000`, '')

    if (pathname.startsWith(`/sites`) && !hostname.endsWith('.vercel.app')) { // prevent canonical link access on subdomains & custom domains
        return new Response(null, { status: 404 })
    }
    
    const previewDeployment = hostname.endsWith('.vercel.app')
    
    if (
        !pathname.includes('.') &&
        !pathname.startsWith('/api')
    ) {
        if (currentHost == 'app') {
            if (pathname === '/login' && (req.cookies['next-auth.session-token'] ||  req.cookies['__Secure-next-auth.session-token'])){
                return NextResponse.redirect('/');
            }
            return NextResponse.rewrite(previewDeployment ? pathname : `/app${pathname}`)        
        } else if (
            currentHost === 'localhost:3000' || currentHost === ''
        ) {
            return NextResponse.rewrite(previewDeployment ? pathname : `/home${pathname}`)        
        }

        return NextResponse.rewrite(previewDeployment ? pathname : `/sites/${currentHost}${pathname}`)
    }
}