import type { ReactNode } from 'react';

export default function Layout({ children, extend }: {children: ReactNode, extend?: string}){
    // return (<div className={`w-${n ?? 1}/6 bg-amber-400`}>  
    return (<div className={`${extend ?? 'w-1/4'} mx-12px bg-amber-400`}>  
        {children}
    </div>)
}