const companyModel = require('../models/company')

let authguard = async(req,res,next)=>{
    let company = await companyModel.findOne({_id: req.session.companyId})
    if (company) {
        next()
    }else{
        res.redirect('/login')
    }
}

module.exports = authguard