import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactById,
  upsertContact,
} from '../services/contacts.js';
import { parseFilters } from '../utils/parseFilters.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilters(req.query);
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};
export const getContactByIdController = async (req, res) => {
  const id = req.params.contactId;
  const contact = await getContactById(id, req.user._id);
  if (!contact) {
    return res.status(404).json({
      status: 404,
      message: `Contact not found with id ${id}`,
    });
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};

export const createContactsController = async (req, res) => {
  const { body, file } = req;
  const contact = await createContact({ ...body, photo: file }, req.user._id);

  res.status(201).json({
    status: 201,
    message: `Successfully created contact!`,
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { body, file } = req;
  const { contactId } = req.params;
  const { contact } = await upsertContact(
    contactId,
    { ...body, photo: file },
    {},
    req.user._id,
  );
  if (!contact) {
    return res.status(404).json({
      status: 404,
      message: `Contact not found with id ${contactId}`,
    });
  }

  res.status(200).json({
    status: 200,
    message: `Successfully patched contacts!`,
    data: contact,
  });
};
export const deleteContactByIdController = async (req, res) => {
  const id = req.params.contactId;
  const contact = await deleteContactById(id, req.user._id);
  if (!contact) {
    return res.status(404).json({
      status: 404,
      message: `Contact not found with id ${id}`,
    });
  }
  res.status(204).send();
};
