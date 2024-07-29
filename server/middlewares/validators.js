const Joi = require('joi');

// Profile Update Schema
const profileUpdateSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  firstname: Joi.string().allow('').optional(),
  lastname: Joi.string().allow('').optional(),
  phonenumber: Joi.string().allow('').optional(),
  roles: Joi.array().optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    coordinates: Joi.object({
      latitude: Joi.number().optional(),
      longitude: Joi.number().optional()
    }).optional()
  }).optional()
});

// Business Create Schema
const businessCreateSchema = Joi.object({
  owner: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    coordinates: Joi.object({
      latitude: Joi.number().optional(),
      longitude: Joi.number().optional()
    }).optional()
  }).optional(),
  phonenumber: Joi.string().optional(),
  email: Joi.string().email().optional(),
  images: Joi.array().items(Joi.string()).optional()
});

// Business Update Schema for PUT
const businessPutSchema = Joi.object({
  owner: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    coordinates: Joi.object({
      latitude: Joi.number().optional(),
      longitude: Joi.number().optional()
    }).optional()
  }).optional(),
  phonenumber: Joi.string().optional(),
  email: Joi.string().email().optional(),
  images: Joi.array().items(Joi.string()).optional()
});

// Business Update Schema for PATCH
const businessPatchSchema = Joi.object({
  owner: Joi.string().optional(),
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    coordinates: Joi.object({
      latitude: Joi.number().optional(),
      longitude: Joi.number().optional()
    }).optional()
  }).optional(),
  phonenumber: Joi.string().optional(),
  email: Joi.string().email().optional(),
  images: Joi.array().items(Joi.string()).optional()
});

// Service Create Schema
const serviceCreateSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  businessId: Joi.string().required(),
  availability: Joi.array().items().optional()
});

// Service Update Schema for PUT
const servicePutSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  businessId: Joi.string().required(),
  availability: Joi.array().items().optional()
});

// Service Update Schema for PATCH
const servicePatchSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().optional(),
  businessId: Joi.string().optional(),
  availability: Joi.array().items().optional()
});

// Booking Create Schema
const bookingCreateSchema = Joi.object({
  serviceId: Joi.string().required(),
  customerId: Joi.string().required(),
  customerName: Joi.string().optional(), // Added customerName
  customerEmail: Joi.string().email().optional(), // Added customerEmail
  customerPhonenumber: Joi.string().optional(), // Added customerPhonenumber
  price: Joi.number().required(), // Ensure price is a number
  date: Joi.date().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  status: Joi.string()
    .valid('pending', 'confirmed', 'cancelled')
    .default('pending')
});

// Booking Update Schema
const bookingUpdateSchema = Joi.object({
  serviceId: Joi.string().optional(),
  customerId: Joi.string().optional(),
  customerName: Joi.string().optional(), // Added customerName
  customerEmail: Joi.string().email().optional(), // Added customerEmail
  customerPhonenumber: Joi.string().optional(), // Added customerPhonenumber
  price: Joi.number().optional(), // Ensure price is a number
  date: Joi.date().optional(),
  startTime: Joi.string().optional(),
  endTime: Joi.string().optional(),
  status: Joi.string().valid('pending', 'confirmed', 'cancelled').optional()
});

// Middleware for validation
const validate = (schema) => (req, res, next) => {
  let data = req.body;

  if (req.is('multipart/form-data')) {
    data = { ...req.body };
    if (req.files && req.files.length > 0) {
      data.images = req.files.map((file) => file.filename);
    }
  }

  const { error } = schema.validate(data);
  if (error) {
    return res.status(400).json({ errors: error.details });
  }
  next();
};

module.exports = {
  validateProfileUpdate: validate(profileUpdateSchema),
  validateBusinessCreate: validate(businessCreateSchema),
  validateBusinessPut: validate(businessPutSchema),
  validateBusinessPatch: validate(businessPatchSchema),
  validateServiceCreate: validate(serviceCreateSchema),
  validateServicePut: validate(servicePutSchema),
  validateServicePatch: validate(servicePatchSchema),
  validateBookingCreate: validate(bookingCreateSchema),
  validateBookingUpdate: validate(bookingUpdateSchema)
};
