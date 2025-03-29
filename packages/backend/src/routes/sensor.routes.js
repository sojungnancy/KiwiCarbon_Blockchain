const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensor.controller');
const { verifyToken, isGovernment, isCompany, isCompanyOwnerOrGovernment } = require('../middleware/auth.middleware');

// All sensor routes are government-only for management
router.post('/', verifyToken, isGovernment, sensorController.createSensor);
router.post('/report_reading', verifyToken, isCompany, sensorController.reportReading)
router.get('/', verifyToken, isGovernment, sensorController.getAllSensors);
router.get('/:id', verifyToken, isCompanyOwnerOrGovernment, sensorController.getSensorById);
router.delete('/:id', verifyToken, isGovernment, sensorController.deleteSensor);

module.exports = router;