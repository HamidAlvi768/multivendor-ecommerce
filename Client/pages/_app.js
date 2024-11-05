import Loading from '@/Component/Loading/Loading';
import { ContentProvider } from '@/ContentControl/ContentControl';
import '@/styles/global.scss'
import { Router } from 'next/router';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        Router.events.on('routeChangeStart', () => {
            setLoading(true);
        });

        Router.events.on('routeChangeComplete', () => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <ContentProvider>
            <Component {...pageProps} />
        </ContentProvider>
    );
}
