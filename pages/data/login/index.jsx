//styles
import className from "classnames/bind";
import styles from "./login.module.scss";
import { useEffect, useState } from "react";

const cx = className.bind(styles);

const Login = () => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleIdChange = (e) => {
    setId(e.target.value);
  };
  const handlePwChange = (e) => {
    setPw(e.target.value);
  };

  const handleSubmitClick = () => {
    console.log("submit");
  };

  useEffect(() => {
    console.log("id", id);
    console.log("pw", pw);
  }, [id, pw]);

  return (
    <div className={cx("login")}>
      <div className={cx("box")}>
        <div className={cx("content-wrap")}>
          <div className={cx("logo")}>
            <img src="/assets/images/logo.png" alt="logo" />
          </div>
          <div className={cx("input-wrap")}>
            <input type="text" className={cx("id")} placeholder={"ID"} value={id} onChange={handleIdChange} />
            <input type="text" className={cx("pw")} placeholder={"PASSWORD"} value={pw} onChange={handlePwChange} />
          </div>
          <button className={cx("btn-submit")} onClick={handleSubmitClick}>
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
