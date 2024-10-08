// import { NextApiRequest, NextApiResponse } from 'next'
// import nodemailer from 'nodemailer'

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' })
//   }

//   const { name, phone, email, message } = req.body

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   })

//   const mailOptions = {
//     from: `"Contact Form" <${process.env.EMAIL_USER}>`,
//     to: 'ratannnxd@gmail.com',
//     subject: 'New Contact Form Submission',
//     text: `
//       Name: ${name}
//       Phone: ${phone}
//       Email: ${email}
//       Message: ${message}
//     `,
//     replyTo: email
//   }

//   try {
//     await transporter.sendMail(mailOptions)
//     res.status(200).json({ message: 'Email sent successfully' })
//   } catch (error) {
//     console.error('Error sending email:', error)
//     res.status(500).json({ error: 'Failed to send email' })
//   }
// }