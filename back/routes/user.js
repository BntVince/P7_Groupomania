const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/user.controller.js')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config.js')

router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)
router.get('/check', auth, userCtrl.check)
router.get('/profil/:id', auth, userCtrl.getProfil)
router.put('/:id/soft', auth, multer, userCtrl.softModifyProfil)
router.put('/:id/hard', auth, userCtrl.checkPassword, userCtrl.hardModifyProfil)
router.post('/:id/delete', auth, userCtrl.checkPassword, userCtrl.deleteProfil)

module.exports = router
