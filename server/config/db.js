const mongoose = require('mongoose');
const Role = require('../models/role');
const Business = require('../models/business');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => {
  console.log('Connected to database');
  init(); // can remove this after first time executing
});

async function init() {
  // initialize our roles for the first time working
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      const roles = ['user', 'admin', 'business'];
      roles.forEach((name) => {
        new Role({ name }).save((err) => {
          if (err) console.log('error', err);
          console.log(`added '${name}' to roles collection`);
        });
      });
    }
  });
  const customerRole = await Role.findOne({ name: 'user' });
  const adminRole = await Role.findOne({ name: 'admin' });


  // Check if admin user exists
  const adminCount = await User.countDocuments({ roles: adminRole._id });
  if (adminCount === 0) {
    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: bcrypt.hashSync('adminpassword', 8),
      roles: [adminRole._id],
      isActive: true,
    });
    await adminUser.save();
  }

  // Check if customer user exists
  const customerCount = await User.countDocuments({ roles: customerRole._id });
  if (customerCount === 0) {
    const customerUser = new User({
      username: 'customer',
      email: 'customer@example.com',
      password: bcrypt.hashSync('customerpassword', 8),
      roles: [customerRole._id],
      isActive: true,
    });
    await customerUser.save();
  }

  const businessCount = await Business.countDocuments();
  if (businessCount === 0) {
    const business = new Business({
      businessName: 'Sample Plumbing Service',
      description: 'We provide top-notch plumbing services',
      services: ['Pipe Repair', 'Drain Cleaning', 'Water Heater Installation'],
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'ST',
        zipCode: '12345',
        coordinates: {
          latitude: 40.7128,
          longitude: -74.006,
        },
      },
      phoneNumber: '555-123-4567',
      email: 'info@sampleplumbing.com',
    });
    await business.save();
  }
}