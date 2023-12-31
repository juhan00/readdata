import Marquee from "react-fast-marquee";

//style
import styles from "./mainMarquee.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

export default function MainMarquee({ props: mainMarqueeData, direction: direction }) {
  return (
    <div className={cx("main-marquee")}>
      <Marquee play direction={direction} speed={50} loop={0} autoFill={true}>
        {mainMarqueeData.map((data, index) => (
          <div key={index}>
            <img src={data.src} alt={data.alt} />
          </div>
        ))}
      </Marquee>
    </div>
  );
}
