import type { EdgeRequest, EdgeResponse } from "next";

export async function middleware(req: EdgeRequest, res: EdgeResponse, next) {
    const hostname = req.headers.get('host')

    const currentHost = process.env.NODE_ENV === 'production' && process.env.VERCEL === '1'
                        ? hostname.replace(`.${process.env.NEXT_PUBLIC_ROOT_URL}`, '')
                        : hostname.replace(`.localhost:3000`, '')

    if (req.url.pathname.startsWith(`/sites`) || req.url.pathname.startsWith(`/app`)) {
        return res.redirect(`/`)
    }
    
    if (
        !req.url.pathname.includes('.') &&
        !req.url.pathname.startsWith('/api')
    ) {
        if (currentHost == 'app') {
            if (req.url.pathname === '/login' && (req.cookies['next-auth.session-token'] ||  req.cookies['__Secure-next-auth.session-token'])){
                return res.redirect('/');
            }
            return res.rewrite(`/app${req.url.pathname}`)        
        } else if (currentHost == 'localhost:3000' || currentHost == process.env.NEXT_PUBLIC_ROOT_URL) {
            return res.rewrite(`/home${req.url.pathname}`)        
        }

        return res.rewrite(`/sites/${currentHost}${req.url.pathname}`)
    }
    
    next();
}