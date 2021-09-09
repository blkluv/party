import { APP_NAME } from '@config/config'
import Head from 'next/head'

export default function Header({ title }: { title: string }) {
    return <Head>
        <title>{`${title} - ${APP_NAME}`}</title>
    </Head>
}