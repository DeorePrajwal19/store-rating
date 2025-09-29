const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize, User, Store, Rating } = require('./src/models');
const authRoutes = require('./src/routes/auth');
const adminRoutes = require('./src/routes/admin');
const storeRoutes = require('./src/routes/store');
const { authenticate } = require('./src/middleware/auth');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', authenticate, adminRoutes);
app.use('/api/stores', authenticate, storeRoutes);
const PORT = process.env.PORT || 5000;
async function start() {
  await sequelize.sync({ alter: true });
  app.listen(PORT, ()=>console.log('Server started on port', PORT));
}
start();
