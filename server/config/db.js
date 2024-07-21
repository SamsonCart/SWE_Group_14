const mongoose = require('mongoose');
const Role = require('../models/role');
const Business = require('../models/business');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Disable deprecated Mongoose options
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Connect to MongoDB using the connection URL from environment variables
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

// Log any connection errors
db.on('error', (error) => console.log(error));

// Log a success message once connected to the database and call init function
db.once('open', () => {
  console.log('Connected to database');
  init(); // you can remove this line after the first-time execution
});

async function init() {
  // Count the number of documents in the Role collection
  Role.estimatedDocumentCount(async (err, count) => {
    // If no error and the roles collection is empty, initialize default roles
    if (!err && count === 0) {
      const roles = ['user', 'admin', 'business'];
      for (const name of roles) {
        try {
          // Create and save each role
          await new Role({ name }).save();
          console.log(`added '${name}' to roles collection`);
        } catch (err) {
          console.log('error', err);
        }
      }
    }

    // Find the 'user' role in the database
    const customerRole = await Role.findOne({ name: 'user' });

    // Find the 'admin' role in the database
    const adminRole = await Role.findOne({ name: 'admin' });
    const businessRole = await Role.findOne({ name: 'business' });

    // Check if the admin role was not found and log an error message
    if (!adminRole) {
      console.error('Admin role not found');
      return;
    }

    // Check if the customer role was not found and log an error message
    if (!customerRole) {
      console.error('Customer role not found');
      return;
    }

    // Count documents in the User collection with the admin role
    const adminCount = await User.countDocuments({ roles: adminRole._id });

    // If no admin user exists, create one
    if (adminCount === 0) {
      const adminUser = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: bcrypt.hashSync('password', 8),
        roles: [adminRole._id],
        isActive: true
      });
      await adminUser.save();
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    // Count documents in the User collection with the admin role
    const businessCount = await User.countDocuments({
      roles: businessRole._id
    });

    // If no business user exists, create one
    if (businessCount === 0) {
      const adminUser = new User({
        username: 'business',
        email: 'business@example.com',
        password: bcrypt.hashSync('password', 8),
        roles: [businessRole._id],
        isActive: true
      });
      await adminUser.save();
      console.log('Business user created');
    } else {
      console.log('Business user already exists');
    }

    // Count documents in the User collection with the customer role
    const customerCount = await User.countDocuments({
      roles: customerRole._id
    });

    // If no customer user exists, create one
    if (customerCount === 0) {
      const customerUser = new User({
        username: 'customer',
        email: 'customer@example.com',
        password: bcrypt.hashSync('password', 8),
        roles: [customerRole._id],
        isActive: true
      });
      await customerUser.save();
      console.log('Customer user created');
    } else {
      console.log('Customer user already exists');
    }

    // // Count documents in the Business collection
    // const businessCount = await Business.countDocuments();

    // // If no business exists, create a sample business
    // if (businessCount === 0) {
    //   const business = new Business({
    //     businessName: 'Sample Plumbing Service',
    //     description: 'We provide top-notch plumbing services',
    //     services: [
    //       'Pipe Repair',
    //       'Drain Cleaning',
    //       'Water Heater Installation'
    //     ],
    //     address: {
    //       street: '123 Main St',
    //       city: 'Anytown',
    //       state: 'ST',
    //       zipCode: '12345',
    //       coordinates: {
    //         latitude: 40.7128,
    //         longitude: -74.006
    //       }
    //     },
    //     phoneNumber: '555-123-4567',
    //     email: 'info@sampleplumbing.com'
    //   });
    //   await business.save();
    //   console.log('Sample business created');
    // } else {
    //   console.log('Sample business already exists');
    // }
  });
}