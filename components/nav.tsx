import Link from "next/link";

export default function Nav(){
    return <>
    <div className="bg-blue-400 w-10 h-10 m-4"></div>
        <nav className="mx-4">
          <div>Home</div>
          <div>Books & Magazines</div>
          <div>3d library</div>
          <Link href="/blog">Blog</Link>
        </nav>
    </>
}