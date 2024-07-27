const Joi = require('joi');
const multer = require('multer');

// Business Create Schema
const businessCreateSchema = Joi.object({
  owner: Joi.string().required(),
  businessName: Joi.string().required(),
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
  phoneNumber: Joi.string().optional(),
  email: Joi.string().email().optional(),
  images: Joi.array().items(Joi.string()).optional()
});

// Business Update Schema for PUT
const businessPutSchema = Joi.object({
  owner: Joi.string().required(),
  businessName: Joi.string().required(),
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
  phoneNumber: Joi.string().optional(),
  email: Joi.string().email().optional(),
  images: Joi.array().items(Joi.string()).optional()
});

// Business Update Schema for PATCH
const businessPatchSchema = Joi.object({
  owner: Joi.string().optional(),
  businessName: Joi.string().optional(),
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
  phoneNumber: Joi.string().optional(),
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
  validateBusinessCreate: validate(businessCreateSchema),
  validateBusinessPut: validate(businessPutSchema),
  validateBusinessPatch: validate(businessPatchSchema),
  validateServiceCreate: validate(serviceCreateSchema),
  validateServicePut: validate(servicePutSchema),
  validateServicePatch: validate(servicePatchSchema),
  validateBookingCreate: validate(bookingCreateSchema),
  validateBookingUpdate: validate(bookingUpdateSchema)
};
