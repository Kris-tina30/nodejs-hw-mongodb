import { Contact } from '../utils/db/models/contacts.js';
import createHttpError from 'http-errors';

export const checkChildPermissions =
  (...roles) =>
  async (req, res, next) => {
    const user = req.user;
    const { contactId } = req.params;

    if (roles.includes('teacher') && user.role === 'teacher') {
      return next();
    }

    if (roles.includes('parent') && user.role === 'parent') {
      const contact = await Contact.findOne({
        _id: contactId,
        userId: user._id,
      });

      if (!contact) {
        return next(createHttpError(403, 'This is not you child!'));
      }

      return next();
    }

    return next(createHttpError(403, 'Forbidden'));
  };
