import React from 'react'
import style from './HomePost.module.scss'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper";
import 'swiper/css';
import { useContext } from 'react';
import Link from 'next/link';
import Server, { ServerId, userAxios } from '@/Config/Server';
import ContentControl from '@/ContentControl/ContentControl';
import { validateAPIResponse } from '@/Utils/validation'

function HomePost({ layout }) {
    // Validate layout prop
    if (!layout) {
        console.error('Layout data is missing')
        return <div>Unable to load content</div>
    }

    const { 
        sectionfour = {}, 
        sectionone = {},
        sectiontwo = {}, 
        sectionthree = {},
        sliderTwo = {}, 
        banner = {}
    } = layout

    const {
        setQuickVw, QuickVw,
        setUserLogged, setLoginModal, setCartTotal
    } = useContext(ContentControl)

    function LogOut() {
        setUserLogged({
            status: false
        })
        localStorage.removeItem('token')
    }

    // Helper function to validate section data
    const validateSection = (section, name) => {
        if (!section || !Array.isArray(section.items)) {
            console.error(`Invalid ${name} data:`, section)
            return false
        }
        return true
    }

    // Helper function to render product card
    const renderProductCard = (obj, key) => {
        if (!obj || !obj._id) return null;

        // Validate required product properties
        if (!obj.uni_id_1 || !obj.uni_id_2 || !obj.files?.[0]?.filename) {
            console.error('Invalid product data:', obj)
            return null
        }

        return (
            <SwiperSlide key={key}>
                <div className={style.UserMainProCard}>
                    <div className={style.UserMainProimgDiv + ' text-center'}>
                        <div>
                            {obj.discount && <button className={style.offerGreen}>{obj.discount}%</button>}
                            {obj.available === "true" ? (
                                <button className={style.cartBtn} onClick={() => handleAddToCart(obj)}>
                                    <i className="fa-solid fa-cart-plus"></i>
                                </button>
                            ) : (
                                <button className={style.cartBtn}>
                                    <i className="fa-solid fa-exclamation"></i>
                                </button>
                            )}
                        </div>
                        <Link href={`/p/${obj.slug}/${obj._id}`} className="LinkTagNonDec">
                            <img
                                src={`${ServerId}/product/${obj.uni_id_1}${obj.uni_id_2}/${obj.files[0].filename}`}
                                loading="lazy" 
                                alt={obj.name || 'Product image'}
                            />
                        </Link>
                        <button 
                            className={style.QuickViewDiv} 
                            onClick={() => handleQuickView(obj)}
                        >
                            QUICK VIEW
                        </button>
                    </div>
                    <Link href={`/p/${obj.slug}/${obj._id}`} className="LinkTagNonDec">
                        <div className='pt-2'>
                            <h6 className='UserGrayMain text-small oneLineTxt'>
                                <small>{obj.category || 'Uncategorized'}</small>
                            </h6>
                            <h6 className='UserBlackMain oneLineTxt'>{obj.name || 'Unnamed Product'}</h6>
                            <h6>
                                <small className='UserGrayMain text-small'>
                                    <del>₹ {obj.mrp || 0}</del>
                                </small> 
                                <span className='UserBlackMain'>₹ {obj.price || 0}</span>
                            </h6>
                        </div>
                    </Link>
                </div>
            </SwiperSlide>
        )
    }

    // Handler for quick view
    const handleQuickView = async (product) => {
        try {
            const response = await Server.get(`/users/product/${product.slug}/${product._id}`)
            if (!response.data?.product) {
                throw new Error('Invalid product data received')
            }
            setQuickVw({
                ...QuickVw, 
                active: true,
                btn: true,
                product: response.data.product
            })
        } catch (error) {
            console.error('Quick view error:', error)
            alert('Unable to load product details')
        }
    }

    // Handler for add to cart
    const handleAddToCart = async (product) => {
        try {
            const response = await userAxios((server) => 
                server.post('/users/addToCart', {
                    item: {
                        quantity: 1,
                        proId: product._id,
                        price: product.price,
                        mrp: product.mrp,
                        variantSize: product.currVariantSize
                    }
                })
            )

            if (response.data.login) {
                LogOut()
                setLoginModal(obj => ({
                    ...obj,
                    btn: true,
                    active: true,
                    member: true,
                    forgot: false
                }))
            } else {
                if (response.data.found) {
                    alert("Already in cart")
                } else {
                    alert("Product added to cart")
                    setCartTotal(amt => amt + parseInt(product.price))
                }
            }
        } catch (error) {
            console.error('Add to cart error:', error)
            alert("Unable to add product to cart")
        }
    }

    return (
        <div className={style.HomePost}>
            {/* Section One */}
            {validateSection(sectionone, 'Section One') && (
                <div className='container'>
                    <div className={style.SECTION1}>
                        <div className='p-3 pt-5'>
                            <h1 className='text-center font-bolder UserBlackMain'>
                                {sectionone.title || 'Featured Products'}
                            </h1>
                            <h6 className='text-center font-bolder UserGrayMain'>
                                {sectionone.subTitle}
                            </h6>
                        </div>
                        {/* Rest of section one JSX */}
                    </div>
                </div>
            )}

            {/* Slider Two */}
            {sliderTwo?.items?.length > 0 && (
                <div className="container p-4 pt-2">
                    <Swiper
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        modules={[Autoplay]}
                        spaceBetween={20}
                        breakpoints={{
                            0: { slidesPerView: '1' },
                            768: { slidesPerView: '1' },
                            992: { slidesPerView: '2' },
                            1205: { slidesPerView: '2' },
                        }}
                    >
                        {sliderTwo.items.map((obj, key) => (
                            obj && obj.uni_id && obj.file?.filename ? (
                                <SwiperSlide key={key}>
                                    <div>
                                        <img 
                                            className='ResponsiveImg rounded' 
                                            style={{ cursor: 'pointer' }}
                                            src={`${ServerId}/${sliderTwo.for}/${obj.uni_id}/${obj.file.filename}`}
                                            loading="lazy" 
                                            alt="slider"
                                            onClick={() => banner?.link && window.open(banner.link, '_blank')}
                                        />
                                    </div>
                                </SwiperSlide>
                            ) : null
                        ))}
                    </Swiper>
                </div>
            )}

            {/* Continue with similar validation patterns for other sections */}
            
        </div>
    )
}

// Add default props
HomePost.defaultProps = {
    layout: {
        sectionfour: {},
        sectionone: {},
        sectiontwo: {},
        sectionthree: {},
        sliderTwo: {},
        banner: {}
    }
}

export default HomePost