'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const screenshots = [
  {
    src: '/screenshots/1.png',
    alt: 'OxyBoost exercise selection screen'
  },
  {
    src: '/screenshots/2.png',
    alt: 'OxyBoost training screen'
  },
  {
    src: '/screenshots/3.png',
    alt: 'OxyBoost statistics screen'
  },
  {
    src: '/screenshots/4.png',
    alt: 'OxyBoost training screen'
  },
  {
    src: '/screenshots/5.png',
    alt: 'OxyBoost statistics screen'
  },
  {
    src: '/screenshots/6.png',
    alt: 'OxyBoost statistics screen'
  }
];

export function Carousel() {
  return (
    <div className="relative max-h-full w-full">
      <Swiper
        effect="coverflow"
        grabCursor={true}
        slidesPerView={3}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: true
        }}
        modules={[ EffectCoverflow, Autoplay ]}
        className="w-full py-12"
      >
        {screenshots.map((screenshot, index) => (
          <SwiperSlide key={index} className="flex justify-center rounded-2xl overflow-hidden">
            <Image
              width={250}
              height={500}
              src={screenshot.src}
              alt={screenshot.alt}
              className="object-cover transition-all duration-300"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

