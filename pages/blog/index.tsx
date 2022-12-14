import Link from 'next/link'
import Head from 'next/head'
import Layout from '../../components/layout';

export default function Blog() {
    return (
        <Layout>
            <Head>
                <title>This is Blog</title>
            </Head>
            <h1 className="text-3xl font-bold underline">Blog</h1>
            <Link href="/">back to index</Link>
        </Layout>
    )
}