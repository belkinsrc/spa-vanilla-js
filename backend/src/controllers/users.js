const User = require('../models/user');

function handleError(res, err) {
  res.status(500);
  res.json(err);
};

async function getUsers(req, res) {
  try {
    const { _q, _page = 1, _limit = 10 } = req.query;
    const page = parseInt(_page);
    const limit = parseInt(_limit);
    const skip = (page - 1) * limit;
    const searchQuery = _q ? new RegExp(_q, 'i') : null;

    let users;

    if (searchQuery) {
      users = await User.find({
        $or: [{ user_name: searchQuery }, { user_fullname: searchQuery }],
      })
        .skip(skip)
        .limit(limit);
      res.status(200).json(users);
    } else {
      users = await User.find().skip(skip).limit(limit);
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
