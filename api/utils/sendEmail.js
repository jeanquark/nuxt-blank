const nodemailer = require('nodemailer')

const sendEmail = async options => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    })

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        // text: options.message,
        // html: `<b>Hey there! </b><br> This is our first message sent with Nodemailer. <br />
        // Click <a href="${process.env.BASE_URL}/auth/reset-password/${options.resetToken}" target="_blank">here</a><br />BASE_URL: ${process.env.BASE_URL}`
        html: options.content
    }

    const info = await transporter.sendMail(message)

    console.log('Message sent: %s', info.messageId)
}

module.exports = sendEmail
