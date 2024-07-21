const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const Business = require('../models/business');
const Availability = require('../models/availability');
const User = require('../models/user');
const Role = require('../models/role');
const Service = require('../models/Service');

// Pre-generated lists
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

const serviceList = [
  { title: 'Leak Repair', description: 'Fix leaks in your pipes and faucets.' },
  {
    title: 'Pipe Installation',
    description: 'Install new pipes in your home.'
  },
  { title: 'Drain Cleaning', description: 'Clean out clogged drains.' },
  {
    title: 'Bridal Makeup',
    description: 'Makeup for the bride on her wedding day.'
  },
  { title: 'Photoshoot Makeup', description: 'Makeup for photoshoots.' },
  { title: 'Event Makeup', description: 'Makeup for special events.' },
  {
    title: 'AC Maintenance',
    description: 'Regular maintenance to keep your AC running smoothly.'
  },
  {
    title: 'AC Installation',
    description: 'Install new air conditioning units.'
  }
];

async function generateRandomTimeSlots(serviceId) {
  const slots = [];
  for (let day = 0; day < 5; day++) {
    // Monday to Friday
    let startHour = 9;
    while (startHour < 17) {
      const duration = faker.number.int({ min: 40, max: 90 });
      const endHour = startHour + duration / 60;
      if (endHour > 17) break;

      const availability = new Availability({
        businessId: serviceId,
        dayOfWeek: day,
        startTime: `${startHour < 10 ? '0' : ''}${startHour}:00`,
        endTime: `${Math.floor(endHour) < 10 ? '0' : ''}${Math.floor(
          endHour
        )}:${(endHour % 1) * 60 === 0 ? '00' : (endHour % 1) * 60}`,
        isBooked: false
      });
      await availability.save();
      slots.push(availability._id);
      startHour = endHour;
    }
  }
  return slots;
}

async function seedData() {
  try {
    const roles = await Role.find();
    const customerRole = roles.find((role) => role.name === 'customer');
    const businessRole = roles.find((role) => role.name === 'business');

    if (!customerRole) throw new Error('Customer role not found');
    if (!businessRole) throw new Error('Business role not found');

    // Create business user if not exists
    await createUserIfNotExists(
      'business',
      'business@example.com',
      'password',
      [businessRole._id]
    );

    // Create customer user if not exists
    await createUserIfNotExists(
      'customer',
      'customer@example.com',
      'password',
      [customerRole._id]
    );

    const businessUsers = await User.find({ roles: businessRole._id });

    for (const user of businessUsers) {
      const businessData =
        businessList[
          faker.number.int({ min: 0, max: businessList.length - 1 })
        ];
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

      const numberOfServices = faker.number.int({ min: 2, max: 3 });
      for (let i = 0; i < numberOfServices; i++) {
        const serviceData =
          serviceList[
            faker.number.int({ min: 0, max: serviceList.length - 1 })
          ];
        const service = new Service({
          title: serviceData.title,
          description: serviceData.description,
          price: faker.commerce.price(),
          businessId: business._id
        });
        service.availableSlots = await generateRandomTimeSlots(service._id);
        await service.save();
      }
    }
    console.log('Data seeding completed');
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error', error);
  }
}

async function createUserIfNotExists(username, email, password, roles) {
  const userCount = await User.countDocuments({ username });
  if (userCount === 0) {
    const newUser = new User({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
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

module.exports = { createUserIfNotExists, seedData };
