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
                profilImg: "",
                password: hash
            };                                     console.log(user)
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
               return res.status(401).json({ message: 'Email' });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid) {
                           return res.status(401).json({ message: 'MDP' });
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