const fs = require('fs');
const db = require('../models')
const Posts = db.posts;

exports.getAllPosts = (req, res, next) => {
    Posts.findAll({
        attributes: {exclude: ['updatedAt']}
    })
        .then((posts) => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};

exports.getOnePost = (req, res, next) => {
    Posts.findOne({ _id: req.params.id })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ error }));
};

exports.addNewPost = (req, res, next) => {
    const newPost = {
        userId: req.auth.userId,
        publisherName: req.body.userName,
        publisherImg: req.body.profilImg,
        description: req.body.description,
        imageUrl: '',
        likes: 0,
    }
    
    console.log(newPost.description)

    Posts.create(newPost)
        .then(() => res.status(201).json({ message: 'Nouveau post ajouté !' }))
        .catch(error => res.status(400).json({ error }));
};

const modifyObject = (object, req, res, next) => {
    Posts.updateOne({ _id: req.params.id }, { ...object, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Post modifié' }))
        .catch(error => res.status(401).json({ error }));
};

exports.modifyPost = (req, res, next) => {
    let postObject
    if (req.file) {
        postObject = {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        };
        delete postObject.userId;

        Posts.findOne({ _id: req.params.id })
            .then(post => {
                if (post.userId === req.auth.userId) {
                    const filename = post.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        modifyObject(postObject, req, res, next);
                    });

                } else {
                    res.status(401).json({ message: 'Opération non-autorisé' })
                }
            })
            .catch(error => res.status(400).json({ error }));

    } else {
        postObject = {
            ...req.body
        };
        delete postObject.userId;

        Posts.findOne({ _id: req.params.id })
            .then(post => {
                if (post.userId === req.auth.userId) {
                    modifyObject(postObject, req, res, next);
                } else {
                    res.status(401).json({ message: 'Opération non-autorisé' })
                }
            })
            .catch(error => res.status(400).json({ error }));

    }
};

exports.deletePosts = (req, res, next) => {

    Posts.findOne({ _id: req.params.id })
        .then((post) => {
            if (post.userId === req.auth.userId) {
                const filename = post.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Posts.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Post supprimé' }))
                        .catch(error => res.status(400).json({ error }));
                })
            } else {
                res.status(500).json({ message: 'Opération non-autorisé' })
            }
        })
        .catch(error => res.status(400).json({ error }));
};

const likePost = (object, req, res, next) => {
    Posts.updateOne({ _id: req.params.id }, { $set: { ...object } })
        .then(() => {
            res.status(201).json({ message: 'Like modifié' })
        })
        .catch(error => res.status(400).json({ error }));
}

exports.addLikeToAPost = (req, res, next) => {
    Posts.findOne({ _id: req.params.id })
        .then(post => {
            const postObject = post;

            if ((req.body.like === 1 || req.body.like === -1) && (postObject.usersLiked.includes(req.auth.userId) || postObject.usersDisliked.includes(req.auth.userId))) {
                res.status(400).json({ message: "Opération non-authorisé" })
            }

            else if (req.body.like === 1) {
                postObject.usersLiked.push(req.auth.userId);
                postObject.likes++;
                likePost(postObject, req, res, next);

            } else if (req.body.like === -1) {
                postObject.usersDisliked.push(req.auth.userId);
                postObject.dislikes++;
                likePost(postObject, req, res, next);

            } else if (req.body.like === 0) {
                const userIndexInLikes = postObject.usersLiked.indexOf(req.auth.userId)
                const userIndexInDislikes = postObject.usersDisliked.indexOf(req.auth.userId)

                if (userIndexInLikes > -1) {
                    postObject.usersLiked.splice(userIndexInLikes, 1);
                    postObject.likes--;
                    likePost(postObject, req, res, next);
                } else if (userIndexInDislikes > -1) {
                    postObject.usersDisliked.splice(userIndexInDislikes, 1);
                    postObject.dislikes--;
                    likePost(postObject, req, res, next);
                } else {
                    res.status(400).json({ message: "Erreur inconnu" })
                }
            } else {
                res.status(400).json({ message: "Valeur innatendu" })
            }
        })
        .catch(error => res.status(400).json({ error }));
};

