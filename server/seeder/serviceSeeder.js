const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Service = require('../models/service');
const Business = require('../models/business');

const serviceList = [
  { title: 'Leak Repair', description: 'Fix leaks in your pipes and faucets.' },
  { title: 'Pipe Installation', description: 'Install new pipes in your home.' },
  { title: 'Drain Cleaning', description: 'Clean out clogged drains.' },
  { title: 'Bridal Makeup', description: 'Makeup for the bride on her wedding day.' },
  { title: 'Photoshoot Makeup', description: 'Makeup for photoshoots.' },
  { title: 'Event Makeup', description: 'Makeup for special events.' },
  { title: 'AC Maintenance', description: 'Regular maintenance to keep your AC running smoothly.' },
  { title: 'AC Installation', description: 'Install new air conditioning units.' }
];

// Function to seed services into the database
async function seedServices(maxServicesPerBusiness) {
  try {
    // Retrieve all businesses from the database
    const businesses = await Business.find();

    // Create services for each business
    for (const business of businesses) {
      const numberOfServices = faker.number.int({
        min: 1,
        max: maxServicesPerBusiness
      });
      for (let i = 0; i < numberOfServices; i++) {
        const serviceData =
          serviceList[
            faker.number.int({ min: 0, max: serviceList.length - 1 })
          ];
        const service = new Service({
          title: serviceData.title,
          description: serviceData.description,
          price: faker.commerce.price(),
          businessId: business._id,
          availability: generateAvailability()
        });
        await service.save();
      }
    }

    console.log('Service seeding completed');
  } catch (error) {
    console.error('Service seeding error', error);
  }
}

// Function to generate availability for services
function generateAvailability() {
  const daysOfWeek = [0, 1, 2, 3, 4]; // 0=Sunday, 1=Monday, etc.
  const availability = [];

  daysOfWeek.forEach((day) => {
    availability.push({
      dayOfWeek: day,
      startTime: '09:00', // 9 AM
      endTime: '18:00', // 6 PM
      sessionDuration: 90 // 90 mins
    });
  });

  return availability;
}

module.exports = seedServices;
