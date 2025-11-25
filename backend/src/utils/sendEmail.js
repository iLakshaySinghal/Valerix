const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, text) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
    });

    console.log("Email sent via Resend →", to);
  } catch (error) {
    console.error("Resend Email Error:", error);
    throw error;
  }
}

module.exports = sendEmail;
