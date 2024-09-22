const express = require('express');
const { getPosts, getPostById } = require('../controllers/posts');
const { getCommentsByPost } = require('../controllers/comments');

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.get('/:id/comments', getCommentsByPost);

module.exports = router;
