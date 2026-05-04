import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    console.log("📧 Sending email to:", to);

    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // change later to your domain
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully:", response);
    return true;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return false;
  }
};

export default sendEmail;