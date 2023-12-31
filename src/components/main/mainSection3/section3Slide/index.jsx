//style
import className from "classnames/bind";
import styles from "./section3Slide.module.scss";
const cx = className.bind(styles);

import { Autoplay, EffectCoverflow, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Section3Slide({ props: section3slideData }) {
  return (
    <div className={cx("section3-slide")}>
      <Swiper
        // ref={swiperRef}
        loop={true} // 슬라이드 루프
        loopedSlides={2}
        spaceBetween={0} // 슬라이스 사이 간격
        slidesPerView={1} // 보여질 슬라이스 수
        navigation={false} // prev, next button
        pagination={{ clickable: true }}
        effect={"coverflow"}
        coverflowEffect={{
          rotate: 0,
          stretch: 100,
          depth: 150,
          modifier: 2.4,
          slideShadows: false,
        }}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false, // 사용자 상호작용시 슬라이더 일시 정지 비활성
        }}
        breakpoints={{
          768: {
            coverflowEffect: {
              modifier: 4.2,
            },
          },
          1080: {
            coverflowEffect: {
              modifier: 4.5,
            },
          },
          1440: {
            coverflowEffect: {
              modifier: 6,
            },
          },
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
      >
        {section3slideData.map((slide, index) => (
          <SwiperSlide key={index}>
            <img src={slide.src} alt={slide.alt} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
