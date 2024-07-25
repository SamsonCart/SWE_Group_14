const mongoose = require('mongoose');
const Role = require('../models/role');
const Business = require('../models/business');
const { seedData, createUserIfNotExists } = require('../seeder/seeder');
require('dotenv').config();

// Connect to MongoDB using the connection URL from environment variables
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000
  })
  .then(() => {
    console.log('Connected to database');
    init();
  })
  .catch((error) => console.error('Connection error', error));

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

    if (!adminRole) throw new Error('Admin role not found');

    // Create admin user if not exists
    await createUserIfNotExists('admin', 'admin@example.com', 'password', [
      adminRole._id
    ]);

    // Check if there are any existing businesses before running seedData
    const businessCount = await Business.estimatedDocumentCount();
    if (businessCount === 0) {
      await seedData();
    } else {
      console.log('Businesses already exist, skipping seeding.');
    }
  } catch (error) {
    console.error('Initialization error', error);
  }
}
