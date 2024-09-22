const Post = require('../models/post');

function handleError(res, err) {
  res.status(500);
  res.json(err);
}

async function getPosts(req, res) {
  try {
    const { _page = 1, _limit = 10, _expand, _q, _userId } = req.query;
    const page = parseInt(_page, 10);
    const limit = parseInt(_limit, 10);
    const skip = (page - 1) * _limit;
    const searchQuery = _q ? new RegExp(_q, 'i') : null;

    const pipeline = [{ $skip: skip }, { $limit: limit }];

    if (_userId) {
      pipeline.push({
        $match: {
          userId: _userId,
        },
      });
    }

    if (searchQuery) {
      pipeline.push({
        $match: {
          text: searchQuery,
        },
      });
    }

    if (_expand === 'user') {
      pipeline.push(
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: 'id',
            as: 'user',
          },
        },
        { $unwind: '$user' }
      );
    }
    const posts = await Post.aggregate(pipeline);
    res.status(200).json(posts);
  } catch (err) {
    handleError(res, err);
  }
}

async function getPostById(req, res) {
  try {
    const { _expand } = req.query;

    const pipeline = [{ $match: { id: req.params.id } }];

    if (_expand === 'user') {
      pipeline.push(
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: 'id',
            as: 'user',
          },
        },
        { $unwind: '$user' }
      );
    }
    const posts = await Post.aggregate(pipeline);
    const post = posts.length > 0 ? posts[0] : null;

    if (post) {
      res.status(200).json(post);
    } else {
      handleError(res, err);
    }
  } catch (err) {
    handleError(res, err);
  }
}

module.exports = {
  getPosts,
  getPostById,
};
