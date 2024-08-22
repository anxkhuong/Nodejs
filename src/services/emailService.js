require('dotenv').config();
const nodemailer = require("nodemailer");
const {resolve} = require("@babel/core/lib/vendor/import-meta-resolve");

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

let getBodyHTMLEmailRemedy = (dataSend) =>{
    let result = ''
    if(dataSend.language === 'vi'){
        result = `
            <h3>Chào ${dataSend.patientName}</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online từ Chlóe</p>
            <p>Thông tin đơn thuốc được gửi trong file đính kèm </p>
            
            <div>Cảm ơn</div>

            `
    }
    if(dataSend.language === 'en'){
        result = `
          <h3>Hello ${dataSend.patientName}</h3>
<p>You are receiving this email because you have booked an online appointment with Chlóe</p>
<p>The prescription information is sent in an attachment </p>

<div>Thank you</div>
            `
    }
    return result;
}

let sendAttachment = async (dataSend) =>{
    return new Promise(async (resolve,reject)=>{
        try {
            //create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host:'smtp.mailersend.net',
                port:587,
                secure:false,//true for 465,false for other ports
                auth:{
                    user:process.env.EMAIL_USERNAME,
                    pass:process.env.EMAIL_PASSWORD
                },
            });
            // send mail with defined transport object
            let info = await transporter.sendMail({
                from:'"Chloe" <MS_26gqWQ@trial-3yxj6ljj9zxldo2r.mlsender.net>', //sender address
                to:dataSend.email,// list of receivers
                subject:'ket qua dat lich kham benh',//subject line
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments:[
                    {
                        filename:`remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split('base64,')[1],
                        encoding:'base64'
                    },
                ],
            });
            resolve(true)
        }catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    sendSimpleEmail:sendSimpleEmail,
    getBodyHTMLEmailRemedy:getBodyHTMLEmailRemedy,
    sendAttachment:sendAttachment
}