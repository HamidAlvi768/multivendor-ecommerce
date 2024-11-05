import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper";
import { ServerId } from '@/Config/Server';
import style from './Slider.module.scss'
import { validateAPIResponse } from '@/Utils/validation'

function Slider({ layout }) {
    // Validate layout and sliderOne data
    if (!layout || !layout.sliderOne || !Array.isArray(layout.sliderOne.items)) {
        console.error('Invalid slider data:', layout)
        return <div className={style.UserSlider}>No slider data available</div>
    }

    const { sliderOne } = layout

    // Validate if items exist and is not empty
    if (!sliderOne.items.length) {
        return <div className={style.UserSlider}>No slides to display</div>
    }

    const renderSlide = (obj, key) => {
        // Validate required properties for each slide
        if (!obj || !obj.uni_id || !obj.file?.filename) {
            console.error('Invalid slide data:', obj)
            return null
        }

        const imageUrl = `${ServerId}/${sliderOne.for}/${obj.uni_id}/${obj.file.filename}`

        return (
            <SwiperSlide key={key}>
                <div>
                    <div 
                        className={style.SlideImgDiv} 
                        style={{ 
                            background: `url(${imageUrl})`, 
                            backgroundRepeat: 'no-repeat', 
                            backgroundSize: 'contain', 
                            backgroundPosition: 'center' 
                        }}
                    >
                        <div className={style.SlideTextDiv}>
                            <div>
                                {/* Use optional chaining and nullish coalescing for text content */}
                                <h5 className={style.SlideSmallText}>
                                    {obj.title ?? 'Untitled'}
                                </h5>
                                <div 
                                    className={style.SlideMainText} 
                                    dangerouslySetInnerHTML={{ 
                                        __html: obj.content ?? '' 
                                    }}
                                />
                                <h6>{obj.subContent ?? ''}</h6>
                                <button 
                                    onClick={() => {
                                        // Validate button link before opening
                                        if (obj.btnLink) {
                                            window.open(obj.btnLink, '_blank')
                                        }
                                    }} 
                                    className={style.shopNowBtn}
                                    // Disable button if no link is provided
                                    disabled={!obj.btnLink}
                                >
                                    {obj.btn ?? 'View'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </SwiperSlide>
        )
    }

    return (
        <div className={style.UserSlider}>
            <div className='container'>
                <Swiper
                    autoplay={{
                        delay: 10000,
                        disableOnInteraction: false,
                    }}
                    modules={[Autoplay]}
                    slidesPerView={1}
                    spaceBetween={10}
                >
                    {sliderOne.items.map((obj, key) => renderSlide(obj, key))}
                </Swiper>
            </div>
        </div>
    )
}

// Add prop type validation
Slider.defaultProps = {
    layout: {
        sliderOne: {
            items: []
        }
    }
}

export default Slider

