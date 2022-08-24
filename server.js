const { server, storage: { directory } } = require('./config.json');
const { readdirSync } = require('fs');

// Server
const express = require('express');

// Middleware
const cookieParser = require('cookie-parser');
const handlebars = require('express-handlebars');

const app = express();

// Configuring Server
const storagePath = directory.startsWith('.') ? __dirname + directory.substring(1) : directory;

app.engine('.hbs', handlebars({
  extname: '.hbs',
  defaultLayout: ''
}));
app.set('view engine', '.hbs');
app.use(express.static(`${__dirname}/assets`));
app.use(express.static(storagePath));
app.use(cookieParser());

// Middleware Registration
const middleware = readdirSync('./middleware/').map(path => require(`./middleware/${path}`));

for (const { name, setup } of middleware.filter(m => !m.options.registerLast)) {
  setup(app);
  console.info(`Registered middleware ${name}`);
}

// Route Registration
const routes = readdirSync('./routes/').map(path => require(`./routes/${path}`));

for (const { method, path, middleware, handler } of routes) {
  app[method](path, ...middleware, handler);
  console.info(`Registered route handler for ${path}`);
}

// Register Post-Setup Middleware
for (const { name, setup } of middleware.filter(m => m.options.registerLast)) {
  setup(app);
  console.info(`Registered middleware ${name}`);
}

// Start Server
app.listen(server.port, server.address);
