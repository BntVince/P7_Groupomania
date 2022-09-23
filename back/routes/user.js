const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/user.controller.js')
const auth = require('../middleware/auth')

router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)
router.get('/check', auth, userCtrl.check)
router.get('/profil/:id', auth, userCtrl.getProfil)

module.exports = router
