require("dotenv").config();
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const formData = req.body;

    // 이메일 전송 코드
    const transporter = nodemailer.createTransport({
      // 이메일 서버 설정
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: "문의하기",
      text: `
        회사명: ${formData.company_name}
        이름: ${formData.name}
        이메일: ${formData.email}
        연락처: ${formData.phone_number}
        문의사항: ${
          (formData.inquiry === "1" && "프로그램 사용 문의") ||
          (formData.inquiry === "2" && "기능문의") ||
          (formData.inquiry === "3" && "미팅요청") ||
          (formData.inquiry === "4" && "요금문의") ||
          (formData.inquiry === "5" && "기타")
        }
        내용: ${formData.message}
        개인정보 수집 동의: ${formData.agree1 ? "동의" : "동의안함"}
        마케팅 정보 수신 동의: ${formData.agree2 ? "동의" : "동의안함"}
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error sending email:", error);

      res.status(500).json({ success: false, error: "Error sending email" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
