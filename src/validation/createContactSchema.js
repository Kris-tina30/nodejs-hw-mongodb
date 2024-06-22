import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  phoneNumber: Joi.string().required().min(3).max(20),
  email: Joi.string().required().min(3).max(20),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .required()
    .min(3)
    .max(20)
    .valid('home', 'personal', 'work')
    .default('personal'),
  //userId: Joi.string().required(),
});
