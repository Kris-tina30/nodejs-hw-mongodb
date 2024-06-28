import { Router } from 'express';

import {
  createContactsController,
  deleteContactByIdController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createContactSchema } from '../validation/createContactSchema.js';
import { validateBody } from '../middlewares/validateBody.js';
import { updateContactSchema } from '../validation/updateContactSchema.js';
import { validateMongoId } from '../middlewares/validateMongodbId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkChildPermissions } from '../middlewares/checkPoles.js';
import { upload } from '../middlewares/upload.js';

const contactsRouter = Router();

contactsRouter.use('/:contactId', validateMongoId('contactId'));
contactsRouter.use('/', authenticate);
contactsRouter.get('', ctrlWrapper(getContactsController));

contactsRouter.get('/:contactId', ctrlWrapper(getContactByIdController));

contactsRouter.post(
  '',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactsController),
);

contactsRouter.patch(
  '/:contactId',
  upload.single('photo'),
  checkChildPermissions('teacher', 'parent'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);
contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactByIdController));
export default contactsRouter;
