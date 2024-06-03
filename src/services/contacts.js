import { Contact } from '../utils/db/models/contacts.js';
import createHttpError from 'http-errors';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  return contact;
};
export const createContact = async (payload) => {
  const contact = await Contact.create(payload);

  return contact;
};
export const upsertContact = async (id, payload, options = {}) => {
  const rawResult = await Contact.findByIdAndUpdate(id, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) {
    throw createHttpError(404, 'Contact not found');
  }

  return {
    contact: rawResult.value,
    isNew: !rawResult?.lastErrorObject?.updatedExisting,
  };
};

export const deleteContactById = async (contactId) => {
  const contact = await Contact.findByIdAndDelete(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
};
