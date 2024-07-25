const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Booking = require('../models/booking');
const Service = require('../models/service');
const User = require('../models/user');
const Role = require('../models/role');

async function seedBookings(bookingCount) {
  try {
    const roles = await Role.find();
    const customerRole = roles.find((role) => role.name === 'customer');
    if (!customerRole) throw new Error('Customer role not found');

    const customers = await User.find({ roles: customerRole._id });
    const services = await Service.find();

    for (let i = 0; i < bookingCount; i++) {
      const service =
        services[faker.number.int({ min: 0, max: services.length - 1 })];
      const customer =
        customers[faker.number.int({ min: 0, max: customers.length - 1 })];

      const date = faker.date.future();
      const startHour = faker.number.int({ min: 9, max: 16 });
      const endHour = startHour + 1;

      const booking = new Booking({
        serviceId: service._id,
        customerId: customer._id,
        date,
        startTime: `${startHour}:00`,
        endTime: `${endHour}:00`,
        status: 'confirmed'
      });
      await booking.save();
    }

    console.log('Booking seeding completed');
  } catch (error) {
    console.error('Booking seeding error', error);
  }
}

module.exports = seedBookings;
