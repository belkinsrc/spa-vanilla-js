const express = require('express');
const { getUsers, getUserById } = require('../controllers/users');
const { getCommentsByUser } = require('../controllers/comments');

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/:id/comments', getCommentsByUser);

module.exports = router;
