import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "whatsapp.clone.ayush@gmail.com",
        pass: "imgo yxml iaoa yxki"
    }
})

async function sendOTP(email, otp) {
    const mailOptions = {
        to: email, 
        subject: 'OTP',
        html: `Your OTP is :<h1>${otp}</h1></br>It is valid for 3 minutes.` 
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Error occurred:', error);
              reject(error);
              return;
            }
            // console.log('Email sent: ' + info.response);
            resolve();
        });
    })
}

export default sendOTP;