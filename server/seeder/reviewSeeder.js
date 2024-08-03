const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Review = require('../models/review');
const Business = require('../models/business');
const User = require('../models/user');
const Role = require('../models/role');

async function seedReviews(reviewCount) {
  try {
    const roles = await Role.find();
    const customerRole = roles.find((role) => role.name === 'customer');
    if (!customerRole) throw new Error('Customer role not found');

    const customers = await User.find({ roles: customerRole._id });
    const businesses = await Business.find();

    for (let i = 0; i < reviewCount; i++) {
      const business =
        businesses[faker.number.int({ min: 0, max: businesses.length - 1 })];
      const customer =
        customers[faker.number.int({ min: 0, max: customers.length - 1 })];

      const review = new Review({
        business: business._id,
        customer: customer._id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentence(),
        response: faker.lorem.sentence(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      });

      await review.save();
    }

    console.log('Review seeding completed');
  } catch (error) {
    console.error('Review seeding error', error);
  }
}

module.exports = seedReviews;
