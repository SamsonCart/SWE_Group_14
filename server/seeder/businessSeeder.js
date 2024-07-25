const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Business = require('../models/business');
const User = require('../models/user');
const Role = require('../models/role');

const businessList = [
  {
    businessName: 'Plumber Pros',
    description: 'Professional plumbing services for all your needs.'
  },
  {
    businessName: 'Makeup Masters',
    description: 'Expert makeup artists for all occasions.'
  },
  {
    businessName: 'AC Repair Experts',
    description: 'Reliable air conditioning repair and maintenance services.'
  }
];

async function seedBusinesses(businessUserCount) {
  try {
    const roles = await Role.find();
    const businessRole = roles.find((role) => role.name === 'business');
    if (!businessRole) throw new Error('Business role not found');

    const businessUsers = await User.find({ roles: businessRole._id }).limit(
      businessUserCount
    );
    let i = 0;
    for (const user of businessUsers) {
      //   const businessData =
      //     businessList[
      //       faker.number.int({ min: 0, max: businessList.length - 1 })
      //     ];
      const businessData = businessList[i];
      i++;
      const business = new Business({
        owner: user._id,
        businessName: businessData.businessName,
        description: businessData.description,
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode(),
          coordinates: {
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude()
          }
        },
        phoneNumber: faker.phone.number(),
        email: faker.internet.email(),
        images: [faker.image.url(), faker.image.url()]
      });
      await business.save();
    }

    console.log('Business seeding completed');
  } catch (error) {
    console.error('Business seeding error', error);
  }
}

module.exports = seedBusinesses;
