const mongoose = require('mongoose'); // [Mongoose Documentation](https://mongoosejs.com/)
const Role = require('../models/role');
const Business = require('../models/business');
const seedDatabase = require('../seeder');
const User = require('../models/user');
const bcrypt = require('bcryptjs'); // [bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)

require('dotenv').config(); // [dotenv Documentation](https://www.npmjs.com/package/dotenv)

// Connect to MongoDB using the connection URL from environment variables
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000
    // bufferCommands: false
  })
  .then(() => {
    console.log('Connected to database');
    init();
  })
  .catch((error) => console.error('Connection error', error));

// Function to create a user if it does not already exist
async function createUserIfNotExists(username, email, password, roles) {
  const userCount = await User.countDocuments({ username });
  if (userCount === 0) {
    const newUser = new User({
      username,
      email,
      password: bcrypt.hashSync(password, 4),
      roles,
      isActive: true
    });
    await newUser.save();
    console.log(
      `${username.charAt(0).toUpperCase() + username.slice(1)} user created`
    );
  } else {
    console.log(
      `${
        username.charAt(0).toUpperCase() + username.slice(1)
      } user already exists`
    );
  }
}

// Initialization function to set up roles and seed database
async function init() {
  try {
    const roles = ['customer', 'admin', 'business'];

    // Initialize roles if they do not exist
    const existingRolesCount = await Role.estimatedDocumentCount();
    if (existingRolesCount === 0) {
      for (const roleName of roles) {
        await new Role({ name: roleName }).save();
        console.log(`Added '${roleName}' to roles collection`);
      }
    }

    const adminRole = await Role.findOne({ name: 'admin' });
    const customerRole = await Role.findOne({ name: 'customer' });
    const businessRole = await Role.findOne({ name: 'business' });

    if (!adminRole || !customerRole || !businessRole)
      throw new Error('One or more roles not found');

    // Create admin user if not exists
    await createUserIfNotExists('admin', 'admin@example.com', 'password', [
      adminRole._id
    ]);

    // Check if there are any existing businesses before running seedData
    const businessCount = await Business.estimatedDocumentCount();
    if (businessCount === 0) {
      await seedDatabase();
    } else {
      console.log('Businesses already exist, skipping seeding.');
    }
  } catch (error) {
    console.error('Initialization error', error);
  }
}
