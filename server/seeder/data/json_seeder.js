const mongoose = require('mongoose');
const Business = require('../../models/business');
const Availability = require('../../models/availability');
const User = require('../../models/user');
const businesses = require('./businesses.json');
const services = require('./services.json');
const Service = require('../../models/service');

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to database');
    init();
  })
  .catch((error) => console.error('Connection error', error));

async function init() {
  try {
    for (const businessData of businesses) {
      const user = await User.findById(businessData.owner);
      if (user) {
        const business = new Business(businessData);
        business.owner = user._id;
        await business.save();

        const serviceData = services.slice(
          0,
          Math.floor(Math.random() * (3 - 2 + 1)) + 2
        ); // Randomly pick 2-3 services
        for (const serviceItem of serviceData) {
          const service = new Service({
            ...serviceItem,
            businessId: business._id
          });
          await service.save();

          for (let day = 0; day < 5; day++) {
            // Monday to Friday
            const availability = new Availability({
              businessId: service._id,
              dayOfWeek: day,
              startTime: '09:00',
              endTime: '17:00'
            });
            await availability.save();
            service.availableSlots.push(availability._id);
          }
          await service.save();
        }
      }
    }
    console.log('Data seeding completed');
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error', error);
  }
}
