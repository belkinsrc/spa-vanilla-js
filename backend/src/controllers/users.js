const User = require('../models');

function handleError(res, err) {
  res.status(500);
  res.json(err);
};

async function getUsers(req, res) {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    const searchQuery = q ? new RegExp(q, 'i') : null;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number(limit);

    let users;

    if (searchQuery) {
      users = await User.find({
        $or: [{ user_name: searchQuery }, { user_fullname: searchQuery }],
      })
        .skip(startIndex)
        .limit(endIndex);
      res.status(200).json(users);
    } else {
      users = await User.find().skip(startIndex).limit(endIndex);
      res.status(200).json(users);
    }
  } catch (err) {
    handleError(res, err);
  }
};

async function getUserById(req, res) {
  try {
    const user = await User.findOne({ id: req.params.id })
    res.status(200).json(user);
  } catch (err) {
    handleError(res, err)
  }
};

module.exports = {
  getUsers,
  getUserById,
};
