require('dotenv').config();
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (dataSend)=> {
    const transporter = nodemailer.createTransport({
        host: "smtp.mailersend.net",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
        let info = await transporter.sendMail({
            from: '"Maddison Foo Koch 👻" <MS_26gqWQ@trial-3yxj6ljj9zxldo2r.mlsender.net>', // sender address
            to: dataSend.reciverEmail, // list of receivers
            subject: "Booking Patient", // Subject line
            html:  getBodyHTMLEmail(dataSend),
        });
}
let getBodyHTMLEmail = (dataSend) =>{
    let result = ''
    if(dataSend.language === 'vi'){
result = `
            <h3>Chào ${dataSend.patientName}</h3>
            <p>Bạn nhận được email này từ đặt lịch khám bệnh chlóe</p>
            <p>Thông tin đặt lịch </p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
            
            <p>Nếu thông tin này chính xác vui lòng nhấp vào link dưới để xác nhạnận</p>
            <div>
            <a href=${dataSend.redirectLink} target="_blank">Nhấn vào đây</a>
            <div>Cảm ơn</div>
</div>
            `
    }
    if(dataSend.language === 'en'){
result = `
            <h3>Dear ${dataSend.patientName}</h3>
            <p>You recive this email because booking online from chloes</p>
            <p>Information booking </p>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>
            
            <p>If information is correct please click this link to confirm</p>
            <div>
            <a href=${dataSend.redirectLink}  target="_blank">Click here</a>
            <div>Thanks</div>
</div>
            `
    }
    return result;
}


module.exports = {
    sendSimpleEmail:sendSimpleEmail
}