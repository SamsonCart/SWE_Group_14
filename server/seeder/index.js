const mongoose = require('mongoose');
const seedUsers = require('./userSeeder');
const seedBusinesses = require('./businessSeeder');
const seedServices = require('./serviceSeeder');
const seedBookings = require('./bookingSeeder');
require('dotenv').config();

async function connectDB() {
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000
  });
}

async function seedDatabase() {
  try {
    // await connectDB();
    const businessUserCount = 3;
    const maxServicesPerBusiness = 3;
    const customerCount = 10;
    const bookingCount = 100;

    await seedUsers(customerCount, businessUserCount);
    await seedBusinesses(businessUserCount);
    await seedServices(maxServicesPerBusiness);
    await seedBookings(bookingCount);

    console.log('Database seeding completed');
  } catch (error) {
    console.error('Database seeding error', error);
  } finally {
    // mongoose.connection.close();
  }
}

module.exports = seedDatabase;
// seedDatabase();
