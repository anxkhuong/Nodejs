import clinicService from '../services/clinicService';

let createClinic = async (req,res) => {
    try {
        let infor = await clinicService.createClinic(req.body);
        return res.status(200).send(infor);
    }catch(e){
        console.log(e);
        return res.status(500).json({
            errCode:-1,
            errMessage: 'Error from the server'
        })
    }
}
let getAllClinic = async (req,res) => {
    try {
        let infor = await clinicService.getAllClinic();
        return res.status(200).send(infor);
    }catch(e){
        console.log(e);
        return res.status(500).json({
            errCode:-1,
            errMessage: 'Error from the server'
        })
    }
}
let getDetailClinictyById = async (req,res) => {
    try {
        let infor = await clinicService.getDetailClinictyById(req.query.id);
        return res.status(200).send(infor);
    }catch(e){
        console.log(e);
        return res.status(500).json({
            errCode:-1,
            errMessage: 'Error from the server'
        })
    }
}

module.exports = {
    createClinic: createClinic,
    getAllClinic:getAllClinic,
    getDetailClinictyById:getDetailClinictyById

}