const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Business = require('../models/business');
const User = require('../models/user');
const Role = require('../models/role');

const businessList = require('./data/businesses.json');
const locationList = require('./data/locations.json');

// Function to seed businesses into the database
async function seedBusinesses(businessUserCount) {
  try {
    // Retrieve roles from the database
    const roles = await Role.find();
    const businessRole = roles.find((role) => role.name === 'business');
    if (!businessRole) throw new Error('Business role not found');

    // Retrieve business users
    const businessUsers = await User.find({ roles: businessRole._id }).limit(
      businessUserCount
    );

    // Create businesses
    for (const [index, user] of businessUsers.entries()) {
      const businessData = businessList[index % businessList.length];
      const locationData = locationList[index % locationList.length];
      const business = new Business({
        owner: user._id,
        name: businessData.name,
        description: businessData.description,
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
        phonenumber: businessData.phonenumber,
        email: businessData.email,
        images: []
      });
      await business.save();
    }

    console.log('Business seeding completed');
  } catch (error) {
    console.error('Business seeding error', error);
  }
}

module.exports = seedBusinesses;
