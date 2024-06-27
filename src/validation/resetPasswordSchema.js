import Joi from 'joi';

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required().min(7).max(20),
  token: Joi.string().required(),
});
