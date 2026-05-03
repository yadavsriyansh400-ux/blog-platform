import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  console.log("📧 sendEmail STARTED"); // ✅ ADD THIS

  try {
    console.log("📧 Sending to:", to); // ✅ ADD THIS

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
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

    console.log("✅ Email sent successfully");
    console.log("Response:", info.response);  

  } catch (error) {
    console.error("❌ Email error:", error); 
  }
};

export default sendEmail;