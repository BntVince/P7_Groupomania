const db = require('../models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = db.users;

exports.signup = (req, res, next) => {
    
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            const user ={
                email: req.body.email,
                userName: req.body.userName,
                profilImg: 'http://localhost:3001/images/profils/default.png',
                password: hash
            };
            User.create(user)
                .then(() => res.status(201).json({ message: 'Utilisateur enregistré' }))
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ where: { email: req.body.email }})
        .then((user) => {
            if (user === null) {
               return res.status(401).json({ message: 'La correspondance email/mot de passe, n\'existe pas!' });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid) {
                           return res.status(401).json({ message: 'La correspondance email/mot de passe, n\'existe pas!' });
                        } else {
                           return res.status(200).json({
                                userId: user.id,
                                token: jwt.sign(
                                    { userId: user.id },
                                    process.env.JWT_SECRET,
                                    { expiresIn: '24h' }
                                )
                            });
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};

exports.check = (req, res, next) => {
    User.findByPk(req.auth.userId, {
        attributes: {exclude: ['id', 'createdAt', 'updatedAt', 'password', 'email']}
    })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(500).json({ error }));
}