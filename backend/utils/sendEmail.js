import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    console.log("📨 Attempting to send email to:", to);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Blog App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.response);

  } catch (error) {
    console.error("❌ Email error:", error);
  }
};

export default sendEmail;