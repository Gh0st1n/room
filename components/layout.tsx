import type { ReactNode } from 'react';

export default function Layout({ children, extend }: {children: ReactNode, extend?: string}){
    return (<div className={`lg:bg-red-400 md:bg-blue-400 sm:bg-green-500 bg-slate-500
    max-w-7xl mx-auto h-screen  ${extend ?? ''}
    `}>  
    <div className="flex flex-row relative">
        {children}
        </div>
    </div>)
}