import { where } from "sequelize";
import db from "../models/index";
import bcrypt from 'bcrypt';
import { raw } from "body-parser";
import { emit } from "nodemon";

const saltRounds = 10;
let hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, saltRounds);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
};


let handleUserLogin = async(email, password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstname', 'lastName', 'gender'],
                    where: { email: email },
                    raw: true,
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Login success';
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                        delete user.password;
                        userData.user = user;
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User not found`;
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Email does not exist in the system. Please try another email.`;
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
                attributes: { exclude: ['image'] },
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
}

let compareUserPassword = () => {
    return new Promise((resolve, reject) => {
        try {

        } catch (e) {
            console.log(e)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let users;
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: { exclude: ['password'] },
                });
            } else if (userId && userId !== 'All') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: { exclude: ['password'] },
                });
            } else {
                // Xử lý trường hợp userId không hợp lệ
                throw new Error('Invalid userId');
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
}

let createNewUser = async(data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'You email is aldready in used, Plz try another email!'
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender === '1' ? true : false,
                    roleId: data.roleId,

                })
                resolve({
                    errCode: 0,
                    message: 'OK'
                })
            }

        } catch (e) {
            reject(e);
        }

    })

}
let deleteUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        let foundUser = await db.User.findOne({
            where: { id: userId }
        })
        if (!foundUser) {
            resolve({
                errCode: 2,
                errMessage: `the user issn' exit`
            })
        }

        await db.User.destroy({
            where: { id: userId }
        });

        resolve({
            errCode: 0,
            message: `the user is deleted`
        })
    })
}
let updateUserData = async(data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: `Missing required parameters`
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                // await db.User.save({
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     address: data.address
                // })
                resolve({
                    errCode: 0,
                    message: `update the user succeeds!`
                })

                await user.save();
                // let allUser = await db.User.findAll();
                let allUser = await db.User.findAll({
                    attributes: { exclude: ['image'] }, // Loại trừ trường 'image'
                    raw: true,
                });
                resolve(allUser);
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `user's not found!`
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}
let getAllCodeService = (typeInput) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required Parameters !`
                })
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }


        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
}