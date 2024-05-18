// import bcrypt from 'bcryptjs';
import bcrypt from 'bcrypt';
import db from "../models"
import { where } from 'sequelize';
const salt = bcrypt.genSaltSync(10);

let createNewUser = async(data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                password: hashPasswordFromBcrypt,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
                phoneNumber: data.phoneNumber,
            })
            resolve('ok !! create a new user succed!')
        } catch (e) {
            reject(e);
        }

    })

}
let hashUserPassword = (password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (e) {
            reject(e);
        }


    })
}
let getAllUser = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = await db.User.findAll({
                attributes: { exclude: ['image'] }, // Loại trừ trường 'image'
                raw: true,
            });
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}
let geUserInfoById = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                attributes: { exclude: ['image'] },
                raw: true,

            })
            if (user) {
                resolve(user)
            } else {
                resolve({})
            }
        } catch (e) {
            reject(e);
        }
    })
}
let updateUserData = async(data) => {
        return new Promise(async(resolve, reject) => {
            try {
                let user = await db.User.findOne({
                    where: { id: data.id }
                })

                if (user) {
                    user.firstName = data.firstName;
                    user.lastName = data.lastName;
                    user.address = data.address;
                    await user.save();

                    let allUser = await db.User.findAll({
                        attributes: { exclude: ['image'] },
                        raw: true,
                    });

                    resolve(allUser);
                } else {
                    resolve();
                }
            } catch (e) {
                reject(e);
            }
        });
    }
    // let updateUserData = async(data) => {
    //     return new Promise(async(resolve, reject) => {
    //         try {
    //             let user = await db.User.findOne({
    //                 where: { id: data.id },
    //                 attributes: ['id', 'firstName', 'lastName', 'address'] // Danh sách các cột cần truy vấn
    //             });
    //             if (user) {
    //                 // Cập nhật thông tin người dùng với dữ liệu mới
    //                 await user.update(data);
    //                 resolve();
    //             } else {
    //                 resolve();
    //             }
    //         } catch (e) {
    //             console.log(e);
    //             reject(e);
    //         }
    //     });
    // };
let deleteUserById = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                attributes: { exclude: ['image'] },
            })
            if (user) {
                await user.destroy();
            }
            resolve(); //return giup thoat ra
        } catch (e) {
            console.log(e);
        }
    })
}
let handleEditUser = async(req, res) => {
    let data = req.body;
    try {
        let message = await userService.updateUserData(data);
        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
module.exports = {
    createNewUser: createNewUser,
    hashUserPassword: hashUserPassword,
    getAllUser: getAllUser,
    geUserInfoById: geUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
    handleEditUser: handleEditUser,
}