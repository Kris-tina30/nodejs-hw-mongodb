import { setupServer } from './server.js';
import { initMongoConnection } from './utils/db/initMongoConnection.js';

(async () => {
  await initMongoConnection();

  setupServer();
})();
