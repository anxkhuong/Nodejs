// import db from '../models/index';
// import {resolve} from "@babel/core/lib/vendor/import-meta-resolve";
// require('dotenv').config();
//
// let postBookAppointment = (data)=>{
//     return new Promise(async(resolve,reject)=>{
//         try {
//             if(!data.email || !data.doctorId || !data.timeType || !data.date){
//                 resolve({
//                     errCode:1,
//                     errMessage:'Missing parameter'
//                 })}else {
//                 ////upsert patient
//                 let user = await db.User.findOrCreate({
//                     where:{email:data.email},
//                     defaults:{
//                        email:data.email,
//                        roleId:'R3'
//                     },
//                 });
//                 console.log('>>>> it check user: ',user[0]);
//                 ///create a booking record
//                 if(user && user[0]){
// await  db.Booking.findOrCreate({
//     where:{ patientId:user[0].id},
//     defaults:{
//         statusId:'S1',
//         doctorId:data.doctorId,
//         patientId:user[0].id,
//         date:data.date,
//         timeType:data.timeType
//     }
// })
//                 }
//                 resolve({
//                     errCode:0,
//                     errMessage:'Save Info patient Success!'
//                 })
//             }
//         }catch (e) {
//             reject(e);
//         }
//     })
// }
//
// module.exports = {
//     postBookAppointment:postBookAppointment
// }


import db from '../models/index';
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';

// Hàm xây dựng URL để gửi qua email
let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra các tham số cần thiết
            if (!data.email || !data.doctorId) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            }

            // Tạo token
            let token = uuidv4();

            // Bước 1: Gửi email
            try {
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName || 'Patient',
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token),
                });
                console.log('Email sent successfully');
            } catch (error) {
                console.log("Error sending email:", error);
                return resolve({
                    errCode: 2,
                    errMessage: 'Failed to send email'
                });
            }

            // Bước 2: Tìm hoặc tạo người dùng (Upsert patient)
            let user;
            try {
                user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.gender,
                        fullName: data.fullName,
                        phoneNumber: data.phoneNumber,
                        address: data.address,
                        birthday: data.birthday
                    },
                });
                console.log('User found or created:', user[0]);
            } catch (error) {
                console.log("Error in findOrCreate user:", error);
                return resolve({
                    errCode: 3,
                    errMessage: 'Failed to find or create user'
                });
            }

            // Bước 3: Tạo hoặc cập nhật bản ghi booking
            try {
                if (user && user[0]) {
                    // Tìm bản ghi booking dựa trên `patientId` và `doctorId`
                    let booking = await db.Booking.findOne({
                        where: {
                            patientId: user[0].id,
                            doctorId: data.doctorId,
                            date: data.date,
                            timeType: data.timeType
                        }
                    });

                    if (booking) {
                        // Nếu bản ghi đã tồn tại, cập nhật token
                        await booking.update({ token: token });
                        console.log('Booking record updated with new token');
                    } else {
                        // Nếu chưa tồn tại, tạo bản ghi mới
                        await db.Booking.create({
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            fullName: data.fullName,
                            phoneNumber: data.phoneNumber,
                            address: data.address,
                            reason: data.reason,
                            birthday: data.birthday,
                            gender: data.gender,
                            token: token
                        });
                        console.log('Booking record created with token');
                    }
                }
            } catch (error) {
                console.log("Error in creating or updating booking:", error);
                return resolve({
                    errCode: 4,
                    errMessage: 'Failed to create or update booking record'
                });
            }

            // Thành công
            resolve({
                errCode: 0,
                errMessage: 'Save Info patient Success!'
            });

        } catch (error) {
            reject(error); // Bắt bất kỳ lỗi nào khác không được dự đoán trước
        }
    });
};

let postVerifyBookAppointment = (data) =>{
    return new Promise(async (resolve,reject) =>{

        try {
            if (!data.token || !data.doctorId) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
            }else {
let appointment = await db.Booking.findOne({
    where:{
        doctorId:data.doctorId,
        token:data.token,
        statusId:'S1'
    },
    raw:false
})
                if(appointment){
                    appointment.statusId = 'S2'
                   await appointment.save()
                    resolve({
                        errCode:0,
                        errMessage:'Update the appointment succeed!'
                    })
                }else {
                    resolve({
                        errCode:2,
                        errMessage:'Appoint ment has been activated or does not exist'
                    })
                }
            }
        }catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment:postVerifyBookAppointment
};
