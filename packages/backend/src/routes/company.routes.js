const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { verifyToken, isGovernment, isCompanyOwnerOrGovernment } = require('../middleware/auth.middleware');

// Government only routes
router.get('/', verifyToken, isGovernment, companyController.getAllCompanies);
router.post('/', verifyToken, isGovernment, companyController.createCompany);
router.put('/approve/:id', verifyToken, isGovernment, companyController.approveCompany);
router.delete('/:id', verifyToken, isGovernment, companyController.deleteCompany);

// Company or Government routes
router.get('/:id', verifyToken, isCompanyOwnerOrGovernment, companyController.getCompanyById);
router.put('/:id', verifyToken, isCompanyOwnerOrGovernment, companyController.updateCompany);

module.exports = router;