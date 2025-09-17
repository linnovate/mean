// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');
require('./config/mongoose');

// Import seeding script
const seedCategories = require('./scripts/seed-categories');

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  app.listen(config.port, async () => {
    console.info(`server started on port ${config.port} (${config.env})`);

    // Seed categories after server starts
    await seedCategories();
  });
}

module.exports = app;
