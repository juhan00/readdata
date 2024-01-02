import { useGlobalState } from "@/context/globalStateContext";

//style
import className from "classnames/bind";
import styles from "./section4Slide.module.scss";
const cx = className.bind(styles);

//i18n

import { useRef } from "react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Section4Slide({ props: section4slideData }) {
  const [{ popupState }, setGlobalState] = useGlobalState();

  const swiperRef = useRef(null);

  const handlePopupOpenClick = (popup) => {
    setGlobalState({
      popupState: {
        isOn: !popupState.isOn,
        popup: popup,
      },
    });
  };

  return (
    <div className={cx("section4-slide")}>
      <Swiper
        loop={true} // 슬라이드 루프
        loopedSlides={2}
        spaceBetween={0} // 슬라이스 사이 간격
        slidesPerView={1.1} // 보여질 슬라이스 수
        navigation={false} // prev, next button
        pagination={{ clickable: true }}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false, // 사용자 상호작용시 슬라이더 일시 정지 비활성
        }}
        breakpoints={{
          768: {
            slidesPerView: 1.2,
          },
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
      >
        {section4slideData.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className={cx("section4-slide-wrap")}>
              <div className={cx("image-wrap")}>
                <img src={slide.src} alt={slide.alt} />
              </div>
              <div className={cx("text-wrap")}>
                <h4>{slide.title}</h4>
                <p className={cx("descript")}>{slide.descript}</p>
                <p className={cx("descript2")}>{slide.descript2}</p>
                {slide?.button ? (
                  <div className={cx("button-wrap")}>
                    <button onClick={() => handlePopupOpenClick(slide.popup)}>{slide.button}</button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
