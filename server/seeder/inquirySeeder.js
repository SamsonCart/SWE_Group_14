const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Inquiry = require('../models/inquiry');
const User = require('../models/user');
const Business = require('../models/business');

async function seedInquiries(inquiryCount) {
  try {
    const customers = await User.find({}); // Assuming all users can be customers
    const businesses = await Business.find();

    for (let i = 0; i < inquiryCount; i++) {
      const customer =
        customers[faker.number.int({ min: 0, max: customers.length - 1 })];
      const business =
        businesses[faker.number.int({ min: 0, max: businesses.length - 1 })];

      const inquiry = new Inquiry({
        customer: customer._id,
        business: business._id,
        content: faker.lorem.paragraph(),
        createdAt: faker.date.recent()
      });
      // Optionally add a response to some inquiries
      if (faker.number.int({ min: 1, max: 2 }) === 1) {
        inquiry.response = {
          content: faker.lorem.sentence(),
          createdAt: faker.date.recent()
        };
      }

      await inquiry.save();
    }

    console.log('Inquiry seeding completed');
  } catch (error) {
    console.error('Inquiry seeding error', error);
  }
}

module.exports = seedInquiries;
