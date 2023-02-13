const express = require('express');
const fs = require('fs');
const companyModel = require('../models/company.js')
const employeeModel = require('../models/employee.js');
const employeeRouter = express.Router();
const authguard = require('../services/authguard');
const multer = require('../services/multer');
require('dotenv').config();

// 1. route pour afficher le dashboard
employeeRouter.get('/employees', authguard, async (req, res) => {
    try {
        let company = await companyModel.findOne({ _id: req.session.companyId }).populate("employees")
        let employees = company.employees
        res.render('templates/main.twig', {
            employees: employees
        })
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

// 2.route pour supprimer un employé
employeeRouter.get('/deleteEmployee/:id', authguard, async (req, res) => {
    try {
        let employee = await employeeModel.findOne({ _id: req.params.id })
        await employeeModel.deleteOne({ _id: req.params.id });
        fs.unlinkSync('assets/uploads/' + employee.image)
        await companyModel.updateOne({ _id: req.session.companyId }, {
            $pull: { employees: { $in: [req.params.id] } }
        })
        res.redirect('/employees')
    } catch (err) {
        console.log(err);
        res.send(err)
    }
})

// 3. Ajouter un employé
// 3. A. route pour accéder à la page d'ajout d'employé
employeeRouter.get('/addEmployee', authguard, async (req, res) => {
    try {
        res.render('templates/addEmployee.twig')
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})


// 3. B. route pour ajouter un nouvel employé
employeeRouter.post('/addEmployee', authguard, multer.single('image'), async (req, res) => {
    try {
        req.body.image = req.file.filename
        let employee = new employeeModel(req.body);
        employee.save();
        await companyModel.updateOne({ _id: req.session.companyId }, { $push: { employees: employee._id } })
        res.redirect('employees')
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

// 4. routes de mise à jour des employés
// 4.A. route pour mettre à jour un employé
employeeRouter.post('/updateEmployee/:id', authguard, multer.single('image'), async (req, res) => {
    try {
        if (req.file) {
            req.body.image = req.file.filename;
            let employee = await employeeModel.findById(req.params.id)
            fs.unlinkSync('assets/uploads/' + employee.image)
        }
        await employeeModel.updateOne({ _id: req.params.id }, req.body);
        res.redirect('/employees')
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

// 4.B. route pour visualiser la page "mise à jour de l'employé"
employeeRouter.get('/updateEmployee/:id', authguard, async (req, res) => {
    try {
        let employee = await employeeModel.findById(req.params.id);
        res.render('templates/updateEmployee.twig', {
            employee: employee
        })
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})


// 5 . routes des blâmes
//5.A.bouton pour ajouter un blame + condition
employeeRouter.get('/addBlame/:id', authguard, async (req, res) => {
    try {
        let employee = await employeeModel.findById(req.params.id)
        let blame = employee.blame
        blame++
        if (blame >= 3) {
            res.redirect("/deleteEmployee/" + req.params.id)
        } else {
            await employeeModel.updateOne({ _id: req.params.id }, { blame: blame })
            res.redirect('/employees')
        }
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

//5.B. bouton pour delete un blame
employeeRouter.get('/deleteBlame/:id', authguard, async (req, res) => {
    try {
        let employee = await employeeModel.findById(req.params.id)
        let blame = employee.blame
        if (blame > 0) {
            blame--
            await employeeModel.updateOne({ _id: req.params.id }, { blame: blame })
        }
        res.redirect('/employees')
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})



module.exports = employeeRouter;