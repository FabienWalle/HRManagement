const express = require('express');
const companyModel = require('../models/company.js');
const companyRouter = express.Router();
const crypto = require('../services/crypto')
require('dotenv').config();

// 1. routes du login
// 1. A. routes pour accéder à la page de login
companyRouter.get('/login', async (req, res) => {
    try {
        res.render('templates/login.twig')
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

// 1. B. route pour valider les login mdp rentrés dans le formulaire
companyRouter.post('/login', async (req, res) => {
    try {
        let company = await companyModel.findOne({ email: req.body.email })
        if (company) {
            if (await crypto.comparePassword(req.body.password, company.password)) {
                req.session.companyId = company._id
                res.redirect('/employees')
            } else {
                res.redirect('/login')
            }
        } else {
            res.redirect('/login')
        }
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

// 2.A. route pour afficher la page d'inscription
companyRouter.get('/subscribe', async (req, res) => {
    try {
        res.render('templates/subscribe.twig')
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

// 2.B. route pour enregister une entreprise
companyRouter.post('/subscribe', async (req, res) => {
    try {
        req.body.password = await crypto.hashPassword(req.body.password)
        let company = new companyModel(req.body);
        company.save();
        res.redirect('login')
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})

//3. route pour se déconnecter
companyRouter.get('/logout', async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('login')
    } catch (err) {
        console.log(err)
        res.send(err)
    }

})

module.exports = companyRouter;