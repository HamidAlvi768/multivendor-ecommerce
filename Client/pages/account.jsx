import LoginError from '@/Component/Error/LoginError'
import Loading from '@/Component/Loading/Loading'
import { userCheck } from '@/Config/Server'
import ContentControl from '@/ContentControl/ContentControl'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Fragment, useContext, useState, useEffect } from 'react'
const Footer = dynamic(() => import('@/Component/User/Footer/Footer'))
const Header = dynamic(() => import('@/Component/User/Header/Header'))
const AccountComp = dynamic(() => import('@/Component/User/Account/AccountComp'))

export default function Account() {
    const { userLogged, setUserLogged, setLoginModal } = useContext(ContentControl)
    const [logError, setLogError] = useState(false)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        let token = localStorage.getItem('token')
        if (token) {
            if (!userLogged.status) {
                userCheck(token, (data) => {
                    console.log('userCheck response:', data)
                    if (data.status) {
                        setUserLogged(data)
                        setLogError(false)
                        setLoaded(true)
                    } else {
                        setUserLogged({ status: false })
                        localStorage.removeItem('token')
                        setLogError(true)
                        setExtraError("Facing An Error in Account Page")
                        setLoginModal(loginModal => ({
                            ...loginModal,
                            btn: true,
                            member: true,
                            active: true
                        }))
                        setLoaded(true)

                    }
                })
            } else {
                setLoaded(true)
            }
        } else {
            setLogError(true)
            setExtraError("Facing An Error in Account Page")
            setLoginModal(loginModal => ({
                ...loginModal,
                btn: true,
                member: true,
                active: true
            }))
            setLoaded(true)
        }

    }, [userLogged])

    return (
        <Fragment>
            <Head>
                <title>Aquariun - Account</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                {
                    loaded ? (
                        <>
                            <Header />
                            {
                                logError ? <LoginError />
                                    : <AccountComp />
                            }
                            <Footer />
                        </>
                    ) : <Loading />
                }
            </main>
        </Fragment>
    )
}