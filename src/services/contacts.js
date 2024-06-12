import { SORT_ORDER } from '../constants/index.js';
import { Contact } from '../utils/db/models/contacts.js';
import createHttpError from 'http-errors';

const createPaginationInformation = (page, perPage, count) => {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  return {
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const skip = perPage * (page - 1);
  const contactsFilters = Contact.find();
  if (filter.type) {
    contactsFilters.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite) {
    contactsFilters.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    Contact.find().merge(contactsFilters).countDocuments(),
    Contact.find()
      .merge(contactsFilters)
      .skip(skip)
      .limit(perPage)
      .sort({
        [sortBy]: sortOrder,
      })
      .exec(),
  ]);

  const paginationInformation = createPaginationInformation(
    page,
    perPage,
    contactsCount,
  );
  return { contacts, ...paginationInformation };
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
