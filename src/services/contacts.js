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
  userId,
}) => {
  const skip = perPage * (page - 1);
  const contactsFilters = Contact.find();
  if (filter.type) {
    contactsFilters.where('contactType').equals(filter.tyxcpe);
  }
  if (filter.isFavourite) {
    contactsFilters.where('isFavourite').equals(filter.isFavourite);
  }
  contactsFilters.where('parentId').equals(userId);
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

export const getContactById = async (id, userId) => {
  const contact = await Contact.findOne({ _id: id, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  return contact;
};
export const createContact = async (payload, userId) => {
  const contact = await Contact.create({ ...payload, userId: userId });

  return contact;
};
export const upsertContact = async (id, payload, options = {}, userId) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: id, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) {
    throw createHttpError(404, 'Contact not found');
  }

  return {
    contact: rawResult.value,
    isNew: !rawResult?.lastErrorObject?.updatedExisting,
  };
};

export const deleteContactById = async (id, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: id, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
};
