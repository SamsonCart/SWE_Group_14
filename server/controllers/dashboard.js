const { response } = require('../classes');
const Business = require('../models/business');
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

exports.getUserBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.userId });
    response.successed(res, business);
  } catch (err) {
    response.failed(res, err.message);
  }
};
