const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Role = require('../models/role');

async function seedUsers(customerCount, businessCount) {
  try {
    const roles = await Role.find();
    const customerRole = roles.find((role) => role.name === 'customer');
    const businessRole = roles.find((role) => role.name === 'business');

    if (!customerRole) throw new Error('Customer role not found');
    if (!businessRole) throw new Error('Business role not found');

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

    for (let i = 0; i < businessCount; i++) {
      await createUserIfNotExists(
        `business${i}`,
        `business${i}@example.com`,
        'password',
        [businessRole._id]
      );
    }

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

async function createUserIfNotExists(username, email, password, roles) {
  const userCount = await User.countDocuments({ username });
  if (userCount === 0) {
    const newUser = new User({
      username,
      email,
      password: bcrypt.hashSync(password, 4),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
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
