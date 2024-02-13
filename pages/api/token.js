require("dotenv").config();
const jwt = require("jsonwebtoken");

export default function handler(req, res) {
  console.log("api접근 완료", req.body);
  const { user_id, user_name, email, companyCode } = req.body;

  const userInfo = {
    user_id: user_id,
    user_name: user_name,
    email: email,
    company_code: companyCode,
  };

  const existingToken = req.headers.authorization;

  if (existingToken) {
    res.json({ token: existingToken });
  } else {
    const token = jwt.sign(userInfo, process.env.NEXT_PUBLIC_TOKEN_SECRET_KEY);
    // 쿠키에 토큰 저장
    // res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); // 1시간 동안 유효
    res.json({ token });
  }
}
