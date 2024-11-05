import LoginError from '@/Component/Error/LoginError'
import Loading from '@/Component/Loading/Loading'
import { userAxios } from '@/Config/Server'
import ContentControl from '@/ContentControl/ContentControl'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useContext, useState, useEffect } from 'react'
const Footer = dynamic(() => import('@/Component/User/Footer/Footer'))
const Header = dynamic(() => import('@/Component/User/Header/Header'))
const OrderDetailsComp = dynamic(() => import('@/Component/User/OrderDetails/OrderDetailsComp'))

export default function OrderDetails() {

    let router = useRouter()

    const { userLogged, setUserLogged, setLoginModal } = useContext(ContentControl)

    const [logError, setLogError] = useState(false)

    const [loaded, setLoaded] = useState(false)

    const [order, setOrder] = useState({})

    const [update, setUpdate] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        setLogError(false)

        if (router.query.orderId) {
            if (token) {
                userAxios((server) => {
                    server.get('/users/getSpecificOrder', {
                        params: {
                            orderId: router.query.orderId
                        }
                    }).then((res) => {
                        if (res.data.login) {
                            setUserLogged({ status: false })
                            localStorage.removeItem('token')
                            setLogError(true)
                            setLoaded(true)
                            setLoginModal(loginModal => ({
                                ...loginModal,
                                btn: true,
                                member: true,
                                active: true
                            }))
                        } else {
                            setLoaded(true)
                            setOrder(res.data)
                        }
                    }).catch((err) => {
                        setLoaded(true)
                        router.push('/error')
                    })
                })
            } else {
                setLoaded(true)
                setLogError(true)
                setLoginModal(loginModal => ({
                    ...loginModal,
                    btn: true,
                    member: true,
                    active: true
                }))
            }
        }
    }, [userLogged, update, router.query])

    return (
        <Fragment>
            <Head>
                <title>Aquariun - Order</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main className='sampleForTest'>
                {
                    loaded ? (
                        <>
                            <Header />
                            {
                                logError ? <LoginError />
                                    : <OrderDetailsComp
                                        order={order}
                                        setLoaded={setLoaded}
                                        setLogError={setLogError}
                                        setUpdate={setUpdate}
                                    />
                            }
                            <Footer />
                        </>
                    )
                        : <Loading />
                }
            </main>
        </Fragment>
    )
}