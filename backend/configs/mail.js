import nodemailer from "nodemailer"; // import 'nodemailer' library to send emails

const transporter = nodemailer.createTransport({ // create an object of 'nodemailer' library using 'createTransport' method and provide the following configurations to it
    service: "Gmail", // Gmail is the email service provider
    port: 465, // port number of Gmail's SMTP server
    secure: true, // enable SSL encryption for secure communication
    // provide sender's email address and password using environment variables
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = async (to, otp) => { // create a function to send emails, it takes receiver's email address and OTP to send as arguments
    transporter.sendMail({ // use 'sendMail' method to send email
        from: process.env.EMAIL, // provide sender's email address using environment variable
        to: to, // provide receiver's email address through the argument
        subject: "Reset Your Password", // subject of the email
        html: `<p>Your OTP for Password Reset is <b>${otp}</b>. It expires in 5 minutes.</p>` // email body in HTML format
    });
};

export default sendMail; // export the function to use it in other files