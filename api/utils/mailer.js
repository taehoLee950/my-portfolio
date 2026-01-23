import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendInquiryEmail = async (fromEmail, message) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Portfolio Inquiry',
      html: `
        <h2>New Inquiry Received</h2>
        <p><strong>From:</strong> ${fromEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    // 이메일 발송 실패해도 문의는 저장되도록 에러를 throw하지 않음
    return { success: false, error: error.message };
  }
};
