'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const screenshots = [
  { src: '/screenshots/app-01.webp', alt: 'Breathing practices made for you' },
  { src: '/screenshots/app-02.webp', alt: 'Pick your perfect exercise' },
  { src: '/screenshots/app-03.webp', alt: 'Visual and audio guidance' },
  { src: '/screenshots/app-04.webp', alt: 'Track your progress' },
  { src: '/screenshots/app-05.webp', alt: 'Every session counts' },
  { src: '/screenshots/app-06.webp', alt: 'Breathe with confidence' },
  { src: '/screenshots/app-07.webp', alt: 'Customize your experience' }
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
              width={400}
              height={868}
              src={screenshot.src}
              alt={screenshot.alt}
              className="w-full h-auto object-contain transition-all duration-300"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

