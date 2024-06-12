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
});

// name: { type: String, required: true },
//     phoneNumber: { type: String, required: true },
//     email: { type: String, required: true },
//     isFavourite: { type: Boolean, default: false },
//     contactType: {
//       type: String,
//       required: true,
//       enum: ['home', 'personal', 'work'],
//       default: 'personal',
//     },
//   },
//   { timestamps: true, versionKey: false },
