const express = require('express');
const router = express.Router();
const companyRoutes = require('./company.routes');
const sensorRoutes = require('./sensor.routes');
const authRoutes = require('./auth.routes');

// Mount the routes
router.use('/api/auth', authRoutes);
router.use('/api/companies', companyRoutes);
router.use('/api/sensors', sensorRoutes);

module.exports = router;