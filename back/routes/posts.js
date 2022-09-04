const express = require('express');
const router = express.Router();
const postsCtrl = require('../controllers/posts.controller.js');
const auth = require('../middleware/auth.js')
const multer = require('../middleware/multer-config.js')

router.get('/', auth, postsCtrl.getAllPosts);
router.get('/:id', auth, postsCtrl.getOnePost);
router.post('/', auth, multer, postsCtrl.addNewPost);
router.put('/:id', auth, multer, postsCtrl.modifyPost);
router.delete('/:id', auth, postsCtrl.deletePosts);
router.post('/:id/like', auth, postsCtrl.addLikeToAPost);

module.exports = router;