const Joi = require('joi');

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

// Availability Create Schema
const availabilityCreateSchema = Joi.object({
  businessId: Joi.string().required(),
  dayOfWeek: Joi.number().min(0).max(6).required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  isBooked: Joi.boolean().optional()
});

// Availability Update Schema for PUT
const availabilityPutSchema = Joi.object({
  businessId: Joi.string().required(),
  dayOfWeek: Joi.number().min(0).max(6).required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  isBooked: Joi.boolean().optional()
});

// Availability Update Schema for PATCH
const availabilityPatchSchema = Joi.object({
  businessId: Joi.string().optional(),
  dayOfWeek: Joi.number().min(0).max(6).optional(),
  startTime: Joi.string().optional(),
  endTime: Joi.string().optional(),
  isBooked: Joi.boolean().optional()
});

// Middleware for validation
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
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
  validateAvailabilityCreate: validate(availabilityCreateSchema),
  validateAvailabilityPut: validate(availabilityPutSchema),
  validateAvailabilityPatch: validate(availabilityPatchSchema)
};
