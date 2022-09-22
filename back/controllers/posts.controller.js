const fs = require('fs')
const db = require('../models')
const Posts = db.posts
const Likes = db.likes

exports.getAllPosts = (req, res, next) => {
   Posts.findAll({
      attributes: { exclude: ['updatedAt', 'createdAt'] },
   })
      .then((posts) => {
         Likes.findAll({
            where: { userId: req.auth.userId },
            attributes: { exclude: ['updatedAt', 'createdAt', 'userId'] },
         }).then((likes) => {
            return res.status(200).json({ posts: posts, likesArray: likes })
         })
      })
      .catch((error) => res.status(400).json({ error }))
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

// exports.getOnePost = (req, res, next) => {
//    Posts.findOne({ where: { id: req.params.id } })
//       .then((post) => res.status(200).json(post))
//       .catch((error) => res.status(404).json({ error }))
// }

//------------------------------------------------------------------------------
//---------------------------------ADDNEWPOST-----------------------------------
//------------------------------------------------------------------------------

exports.addNewPost = (req, res, next) => {
   let newPost = {
      userId: req.auth.userId,
      publisherName: req.body.userName,
      publisherImg: req.body.profilImg,
      description: req.body.description,
      likes: 0,
   }

   if (req.file) {
      newPost.imageUrl = `${req.protocol}://${req.get('host')}/images/${
         req.file.filename
      }`
   }
   Posts.create(newPost)
      .then((post) => {
         let postToAdd = post.dataValues
         delete postToAdd.updatedAt
         delete postToAdd.createdAt
         return res
            .status(201)
            .json({ postToAdd, message: 'Nouveau post ajouté !' })
      })
      .catch((error) => res.status(400).json({ error }))
}

//------------------------------------------------------------------------------
//---------------------------------MODIFY POST----------------------------------
//------------------------------------------------------------------------------

exports.modifyPost = (req, res, next) => {
   let postObject = { description: req.body.description }
   if (req.file) {
      // <<<=================
      postObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${
         req.file.filename
      }`

      Posts.findByPk(req.params.id)
         .then((post) => {
            if (post.userId == req.auth.userId) {
               if (post.imageUrl) {
                  const filename = post.imageUrl.split('/images/')[1]
                  fs.unlink(`images/${filename}`, () => {
                     Posts.update(postObject, { where: { id: req.params.id } })
                        .then(() => {
                           const updatedPost = {
                              ...post.dataValues,
                              description: postObject.description,
                              imageUrl: postObject.imageUrl,
                           }
                           delete updatedPost.createdAt
                           delete updatedPost.updatedAt
                           return res.status(200).json({
                              message: 'Post modifié',
                              updatedPost: updatedPost,
                           })
                        })
                        .catch((error) => res.status(401).json({ error }))
                  })
               } else {
                  Posts.update(postObject, { where: { id: req.params.id } })
                     .then(() => {
                        const updatedPost = {
                           ...post.dataValues,
                           description: postObject.description,
                           imageUrl: postObject.imageUrl,
                        }
                        delete updatedPost.createdAt
                        delete updatedPost.updatedAt
                        return res.status(200).json({
                           message: 'Post modifié',
                           updatedPost: updatedPost,
                        })
                     })
                     .catch((error) => res.status(401).json({ error }))
               }
            } else {
               res.status(401).json({ message: 'Opération non-autorisé' })
            }
         })
         .catch((error) => res.status(400).json({ error }))
   } else {
      Posts.findByPk(req.params.id)
         .then((post) => {
            if (post.userId == req.auth.userId) {
               if (req.body.cancelImg === 'true') {
                  postObject.imageUrl = null

                  const filename = post.imageUrl.split('/images/')[1]
                  fs.unlink(`images/${filename}`, () => {
                     Posts.update(postObject, { where: { id: req.params.id } })
                        .then(() => {
                           const updatedPost = {
                              ...post.dataValues,
                              description: postObject.description,
                              imageUrl: postObject.imageUrl,
                           }
                           delete updatedPost.createdAt
                           delete updatedPost.updatedAt
                           return res.status(200).json({
                              message: 'Post modifié',
                              updatedPost: updatedPost,
                           })
                        })
                        .catch((error) => res.status(401).json({ error }))
                  })
               } else {
                  Posts.update(postObject, { where: { id: req.params.id } })
                     .then(() => {
                        const updatedPost = {
                           ...post.dataValues,
                           description: postObject.description,
                        }
                        delete updatedPost.createdAt
                        delete updatedPost.updatedAt
                        return res.status(200).json({
                           message: 'Post modifié',
                           updatedPost: updatedPost,
                        })
                     })
                     .catch((error) => res.status(401).json({ error }))
               }
            } else {
               res.status(401).json({ message: 'Opération non-autorisé' })
            }
         })
         .catch((error) => res.status(400).json({ error }))
   }
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

exports.deletePosts = (req, res, next) => {
   Posts.findByPk(req.params.id)
      .then((post) => {
         if (post.userId == req.auth.userId) {
            if (post.imageUrl === '' || !post.imageUrl) {
               Posts.destroy({ where: { id: req.params.id } })
                  .then(() =>
                     res.status(200).json({ message: 'Post supprimé' })
                  )
                  .catch((error) => res.status(400).json({ error }))
            } else {
               const filename = post.imageUrl.split('/images/')[1]
               fs.unlink(`images/${filename}`, () => {
                  Posts.destroy({ where: { id: req.params.id } })
                     .then(() =>
                        res.status(200).json({ message: 'Post supprimé' })
                     )
                     .catch((error) => res.status(400).json({ error }))
               })
            }
         } else {
            res.status(500).json({ message: 'Opération non-autorisé' })
         }
      })
      .catch((error) => res.status(400).json({ error }))
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

exports.addLikeToAPost = (req, res, next) => {
   Likes.findOne({ where: { postId: req.params.id, userId: req.auth.userId } })
      .then((like) => {
         if (!like) {
            const newLike = {
               userId: req.auth.userId,
               postId: req.params.id,
            }
            Likes.create(newLike)
               .then(() => {
                  Posts.findByPk(req.params.id).then((post) => {
                     Posts.update(
                        { likes: post.likes + 1 },
                        { where: { id: req.params.id } }
                     )
                        .then(() =>
                           res.status(200).json({ message: 'Like ajouté' })
                        )
                        .catch(() => res.status(400).json({ error }))
                  })
               })
               .catch((error) => res.status(400).json({ error }))
         } else {
            Likes.destroy({
               where: { postId: req.params.id, userId: req.auth.userId },
            })
               .then(() => {
                  Posts.findByPk(req.params.id).then((post) => {
                     Posts.update(
                        { likes: post.likes - 1 },
                        { where: { id: req.params.id } }
                     )
                        .then(() =>
                           res.status(200).json({ message: 'Like retiré' })
                        )
                        .catch(() => res.status(400).json({ error }))
                  })
               })
               .catch(() => res.status(400).json({ error }))
         }
      })
      .catch(() => res.status(400).json({ error }))
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
