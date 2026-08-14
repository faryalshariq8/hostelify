const { Resend } = require('resend');

const sendEmail = async (options) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not defined. Email will not be sent.");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const data = await resend.emails.send({
      from: 'Hostelify <onboarding@resend.dev>', // Free tier must use this sender
      to: options.email,
      subject: options.subject,
      text: options.message,
    });
    
    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error sending email via Resend:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
