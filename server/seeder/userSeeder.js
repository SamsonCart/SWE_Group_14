const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Role = require('../models/role');

const businessList = require('./data/businesses.json');
const locationList = require('./data/locations.json');

// Function to seed users into the database
async function seedUsers(customerCount, businessCount) {
  try {
    // Retrieve roles from the database
    const roles = await Role.find();
    const customerRole = roles.find((role) => role.name === 'customer');
    const businessRole = roles.find((role) => role.name === 'business');

    if (!customerRole) throw new Error('Customer role not found');
    if (!businessRole) throw new Error('Business role not found');

    // Create example users if they do not already exist
    await createUserIfNotExists(
      'business',
      'business@example.com',
      'password',
      [businessRole._id]
    );
    await createUserIfNotExists(
      'customer',
      'customer@example.com',
      'password',
      [customerRole._id]
    );

    // Create business users
    for (let i = 0; i < businessCount; i++) {
      await createUserIfNotExists(
        `business${i}`,
        `business${i}@example.com`,
        'password',
        [businessRole._id]
      );
    }

    // Create customer users
    for (let i = 0; i < customerCount; i++) {
      await createUserIfNotExists(
        `customer${i}`,
        `customer${i}@example.com`,
        'password',
        [customerRole._id]
      );
    }

    console.log('User seeding completed');
  } catch (error) {
    console.error('User seeding error', error);
  }
}

// Helper function to create a user if it does not already exist
async function createUserIfNotExists(username, email, password, roles) {
  const userCount = await User.countDocuments({ username });
  if (userCount === 0) {
    const locationData =
      locationList[faker.number.int({ min: 0, max: locationList.length - 1 })];
    const newUser = new User({
      username,
      email,
      password: bcrypt.hashSync(password, 4),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      phonenumber: faker.phone.number(),
      address: {
        street: locationData.street,
        city: 'Los Angeles',
        state: 'California',
        zipCode: locationData.zipCode,
        coordinates: {
          latitude: locationData.coordinates.latitude,
          longitude: locationData.coordinates.longitude
        }
      },
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

module.exports = seedUsers;
