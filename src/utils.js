import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();
//============================ Generate random OTP =========================================================
 let currentOtp=null
    export function generateOTP() {
        return currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
    }


//======================================== sendin OTP by Mail================================================
export async function sendResponseEmail(user_email, OTP) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user_email,
      subject: 'Re: Hello from Raiplus!',
      html: `

  <p>Hi <strong>User</strong>,</p>

<p>We received a request to generate a One-Time Password (OTP) for your account for project AUTH.</p>

<div style="
    display: inline-block;
    padding: 15px 25px;
    background-color: #f9f9f9;
    border: 2px dashed #4CAF50;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 2px;
    margin: 20px 0;
    text-align: center;
">
  ${OTP}
</div>

<p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>

<p>If you did not request this, you can safely ignore this email.</p>

<p>Best regards,<br>
<strong>Raiplus Team</strong></p>

  `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:')

  } catch (error) {
    console.error('Error sending email:', error)
  }
}

