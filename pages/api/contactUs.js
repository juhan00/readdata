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
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: "New Inquiry",
      text: `
        Company Name: ${formData.company_name}
        Name: ${formData.name}
        Email: ${formData.email}
        Phone Number: ${formData.phone_number}
        Inquiry Type: ${formData.inquiry}
        Message: ${formData.message}
        Privacy Agreement: ${formData.agree1 ? "Agreed" : "Not Agreed"}
        Marketing Agreement: ${formData.agree2 ? "Agreed" : "Not Agreed"}
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info);
      // 이메일 전송 후 필요한 동작 수행
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error sending email:", error);
      // 에러 처리
      res.status(500).json({ success: false, error: "Error sending email" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
