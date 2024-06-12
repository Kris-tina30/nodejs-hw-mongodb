import Joi from 'joi';

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()

    .min(3)
    .max(20)
    .valid('home', 'personal', 'work')
    .default('personal'),
});
