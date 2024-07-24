const { response } = require('../classes');
const User = require('../models/user');

exports.getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const data = { count: { user: userCount } };
    response.successed(res, data);
  } catch (err) {
    response.failed(res, err.message);
  }
};
