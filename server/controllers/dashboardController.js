const User = require('../models/user');

exports.getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const data = { count: { user: userCount } };
    res.status(200).send({ isSuccess: true, data });
  } catch (err) {
    res.status(500).send(err);
  }
};