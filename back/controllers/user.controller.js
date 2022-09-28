const db = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = db.users
const Posts = db.posts
const fs = require('fs')

exports.signup = (req, res, next) => {
   bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
         const user = {
            email: req.body.email,
            userName: req.body.userName,
            profilImg: 'http://localhost:3001/images/default.png',
            password: hash,
         }
         User.create(user)
            .then(() =>
               res.status(201).json({ message: 'Utilisateur enregistré' })
            )
            .catch((error) => res.status(400).json({ error }))
      })
      .catch((error) => res.status(500).json({ error }))
}

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
                           { userId: user.id },
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

exports.check = (req, res, next) => {
   User.findByPk(req.auth.userId, {
      attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'email'] },
   })
      .then((user) => res.status(200).json(user))
      .catch((error) => res.status(500).json({ error }))
}

exports.getProfil = (req, res, next) => {
   User.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt', 'password', 'email'] },
   })
      .then((user) => {
         console.log(user)
         return res.status(200).json(user)
      })
      .catch((error) => res.status(500).json({ error }))
}

exports.softModifyProfil = (req, res, next) => {
   let newUserData = { userName: req.body.userName }
   if (req.file) {
      newUserData.profilImg = `${req.protocol}://${req.get('host')}/images/${
         req.file.filename
      }`

      User.findByPk(req.params.id)
         .then((user) => {
            if (user.id == req.auth.userId) {
               if (
                  user.profilImg ===
                  `${req.protocol}://${req.get('host')}/images/default.png`
               ) {
                  User.update(newUserData, { where: { id: req.auth.userId } })
                     .then(() => {
                        console.log('ici')
                        const updatedProfil = {
                           ...newUserData,
                        }
                        Posts.update(
                           {
                              publisherName: newUserData.userName,
                              publisherImg: newUserData.profilImg,
                           },
                           { where: { userId: req.auth.userId } }
                        )
                           .then(() =>
                              res.status(201).json({
                                 message: 'Utilisateur modifié',
                                 updatedProfil: updatedProfil,
                              })
                           )
                           .catch((error) => res.status(400).json({ error }))
                     })
                     .catch((error) => res.status(400).json({ error }))
               } else {
                  const filename = user.profilImg.split('/images/')[1]
                  fs.unlink(`images/${filename}`, () => {
                     User.update(newUserData, {
                        where: { id: req.auth.userId },
                     })
                        .then(() => {
                           const updatedProfil = {
                              ...newUserData,
                           }
                           Posts.update(
                              {
                                 publisherName: newUserData.userName,
                                 publisherImg: newUserData.profilImg,
                              },
                              { where: { userId: req.auth.userId } }
                           )
                              .then(() =>
                                 res.status(201).json({
                                    message: 'Utilisateur modifié',
                                    updatedProfil: updatedProfil,
                                 })
                              )
                              .catch((error) => res.status(400).json({ error }))
                        })
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
                     Posts.update(
                        { publisherName: newUserData.userName },
                        { where: { userId: req.auth.userId } }
                     )
                        .then(() =>
                           res.status(201).json({
                              message: 'Utilisateur modifié',
                              updatedProfil: updatedProfil,
                           })
                        )
                        .catch((error) => res.status(400).json({ error }))
                  })
                  .catch((error) => res.status(400).json({ error }))
            } else {
               return res.status(400).json({ error })
            }
         })
         .catch((error) => res.status(400).json({ error }))
   }
}

exports.hardModifyProfil = (req, res, next) => {}
