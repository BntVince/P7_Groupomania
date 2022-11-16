const db = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = db.users
const Posts = db.posts
const fs = require('fs')

//------------------------------------------------------------------------------
//---------------------------------CREATION DE COMPTE---------------------------
//------------------------------------------------------------------------------

exports.signup = (req, res, next) => {
   bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
         const user = {
            email: req.body.email,
            userName: req.body.userName,
            password: hash,
            isAdmin: false,
         }
         User.create(user)
            .then((user) => {
               res.status(201).json({
                  message: 'Utilisateur enregistré',
                  userId: user.id,
                  token: jwt.sign(
                     { userId: user.id, isAdmin: user.isAdmin },
                     process.env.JWT_SECRET,
                     { expiresIn: '24h' }
                  ),
               })
            })
            .catch((error) => res.status(400).json({ error }))
      })
      .catch((error) => res.status(500).json({ error }))
}

//------------------------------------------------------------------------------
//---------------------------------CONNEXION------------------------------------
//------------------------------------------------------------------------------

exports.login = (req, res, next) => {
   User.findOne({ where: { email: req.body.email } })
      .then((user) => {
         if (user === null) {
            return res.status(401).json({
               message: "La correspondance email/mot de passe, n'existe pas!",
            })
         } else {
            bcrypt
               .compare(req.body.password, user.password)
               .then((valid) => {
                  if (!valid) {
                     return res.status(401).json({
                        message:
                           "La correspondance email/mot de passe, n'existe pas!",
                     })
                  } else {
                     return res.status(200).json({
                        userId: user.id,
                        token: jwt.sign(
                           { userId: user.id, isAdmin: user.isAdmin },
                           process.env.JWT_SECRET,
                           { expiresIn: '24h' }
                        ),
                     })
                  }
               })
               .catch((error) => res.status(500).json({ error }))
         }
      })
      .catch((error) => res.status(500).json({ error }))
}

//------------------------------------------------------------------------------
//-------------------------------CHECK ACTIVE USER------------------------------
//------------------------------------------------------------------------------

exports.check = (req, res, next) => {
   User.findByPk(req.auth.userId, {
      attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'email'] },
   })
      .then((user) => res.status(200).json(user))
      .catch((error) => res.status(500).json({ error }))
}

exports.getProfil = (req, res, next) => {
   User.findByPk(req.params.id, {
      attributes: {
         exclude: ['createdAt', 'updatedAt', 'password', 'email', 'isAdmin'],
      },
   })
      .then((user) => {
         console.log(user)
         return res.status(200).json(user)
      })
      .catch((error) => res.status(500).json({ error }))
}

//------------------------------------------------------------------------------
//--------------------------------SOFT MODIFY-----------------------------------
//------------------------------------------------------------------------------

exports.softModifyProfil = (req, res, next) => {
   let newUserData = { userName: req.body.userName }
   if (req.file) {
      newUserData.profilImg = `${req.protocol}://${req.get('host')}/images/${
         req.file.filename
      }`

      User.findByPk(req.params.id)
         .then((user) => {
            if (user.id == req.auth.userId) {
               console.log(user.profilImg)
               if (user.profilImg == null) {
                  User.update(newUserData, { where: { id: req.auth.userId } })
                     .then(() =>
                        res.status(201).json({
                           message: 'Utilisateur modifié',
                           updatedProfil: newUserData,
                        })
                     )
                     .catch((error) => res.status(400).json({ error }))
               } else {
                  const filename = user.profilImg.split('/images/')[1]
                  fs.unlink(`images/${filename}`, () => {
                     User.update(newUserData, {
                        where: { id: req.auth.userId },
                     })
                        .then(() =>
                           res.status(201).json({
                              message: 'Utilisateur modifié',
                              updatedProfil: newUserData,
                           })
                        )
                        .catch((error) => res.status(400).json({ error }))
                  })
               }
            } else {
               return res.status(400).json({ error })
            }
         })
         .catch((error) => res.status(400).json({ error }))
   } else {
      User.findByPk(req.params.id)
         .then((user) => {
            if (user.id == req.auth.userId) {
               User.update(newUserData, { where: { id: req.auth.userId } })
                  .then(() => {
                     const updatedProfil = {
                        ...newUserData,
                        profilImg: user.profilImg,
                     }
                     return res.status(201).json({
                        message: 'Utilisateur modifié',
                        updatedProfil: updatedProfil,
                     })
                  })
                  .catch((error) => res.status(400).json({ error }))
            } else {
               return res.status(400).json({ error })
            }
         })
         .catch((error) => res.status(400).json({ error }))
   }
}

//------------------------------------------------------------------------------
//---------------------------MIDDLEWARE PASSWORD--------------------------------
//------------------------------------------------------------------------------

exports.checkPassword = (req, res, next) => {
   if (req.params.id != req.auth.userId && !req.auth.isAdmin) {
      return res.status(500).json({ message: 'Opération non autorisé' })
   } else {
      User.findByPk(req.params.id).then((user) => {
         bcrypt
            .compare(req.body.currentPassword, user.password)
            .then((valid) => {
               if (!valid && !req.auth.isAdmin) {
                  return res.status(500).json({
                     message: 'Opération non autorisé',
                  })
               } else {
                  next()
               }
            })
            .catch((error) => res.status(401).json({ error }))
      })
   }
}

//------------------------------------------------------------------------------
//--------------------------------HARD MODIFY-----------------------------------
//------------------------------AFTER PASS CHECK--------------------------------

exports.hardModifyProfil = (req, res, next) => {
   User.findByPk(req.params.id)
      .then((user) => {
         if (req.auth.userId != user.id) {
            return res.status(500).json({ message: 'Opération non autorisé' })
         } else {
            const newUserData = {}
            if (req.body.email && req.body.newPassword) {
               bcrypt
                  .hash(req.body.newPassword, 10)
                  .then((hash) => {
                     newUserData.password = hash
                     newUserData.email = req.body.email
                     User.update(newUserData, { where: { id: req.params.id } })
                        .then(() =>
                           res
                              .status(201)
                              .json({ message: 'Données modifiées!' })
                        )
                        .catch((error) => res.status(401).json({ error }))
                  })
                  .catch((error) => res.status(500).json({ error }))
            } else if (req.body.newPassword) {
               bcrypt
                  .hash(req.body.newPassword, 10)
                  .then((hash) => {
                     newUserData.password = hash
                     User.update(newUserData, { where: { id: req.params.id } })
                        .then(() =>
                           res
                              .status(201)
                              .json({ message: 'Données modifiées!' })
                        )
                        .catch((error) => res.status(401).json({ error }))
                  })
                  .catch((error) => res.status(500).json({ error }))
            } else if (req.body.email) {
               newUserData.email = req.body.email
               User.update(newUserData, { where: { id: req.params.id } })
                  .then(() =>
                     res.status(201).json({ message: 'Données modifiées!' })
                  )
                  .catch((error) => res.status(401).json({ error }))
            } else {
               return res.status(400).json({ error })
            }
         }
      })
      .catch((error) => res.status(401).json({ error }))
}

//------------------------------------------------------------------------------
//-------------------------------DELETE ACCOUNT---------------------------------
//------------------------------AFTER PASS CHECK--------------------------------

exports.deleteProfil = (req, res, next) => {
   User.findByPk(req.params.id)
      .then((user) => {
         if (user.profilImg) {
            const filename = user.profilImg.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => {
               User.destroy({ where: { id: req.params.id } })
                  .then(() =>
                     res.status(201).json({ message: 'Utilisateur Supprimé' })
                  )
                  .catch((error) => res.status(401).json({ error }))
            })
         } else {
            User.destroy({ where: { id: req.params.id } })
               .then(() =>
                  res.status(201).json({ message: 'Utilisateur Supprimé' })
               )
               .catch((error) => res.status(401).json({ error }))
         }
      })
      .catch((error) => res.status(401).json({ error }))
}
