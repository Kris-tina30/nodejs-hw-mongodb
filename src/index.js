import { setupServer } from './server.js';
import { initMongoConnection } from './utils/db/initMongoConnection.js';
import { Contact } from './utils/db/models/contacts.js';

(async () => {
  await initMongoConnection();
  const contacts = await Contact.find({});
  console.log(contacts);
  setupServer();
})();
