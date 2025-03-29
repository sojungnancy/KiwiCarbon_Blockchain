const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// Create a new company
exports.createCompany = async (req, res) => {
    try {
      // Ensure only government can create companies directly
      if (req.user.role !== 'government') {
        return res.status(403).json({ 
          message: 'Only government can create companies directly. Companies should register through the registration endpoint.' 
        });
      }
      
      const { name, walletAddress, password } = req.body;
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const company = await prisma.company.create({
        data: {
          name,
          walletAddress,
          password: hashedPassword,
          approved: true, // Auto-approve when created by government
        },
      });
  
      // Remove password from response
      const { password: _, ...companyWithoutPassword } = company;
      
      res.status(201).json(companyWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        walletAddress: true,
        approved: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password
      },
    });
    
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const company = await prisma.company.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        walletAddress: true,
        approved: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password
        sensors: true, // Include related sensors
      },
    });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update company
exports.updateCompany = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, walletAddress } = req.body;
      
      const updateData = {};
      
      // Allow government to update any field
      if (req.user.role === 'government') {
        if (name) updateData.name = name;
        if (walletAddress !== undefined) updateData.walletAddress = walletAddress;
      } 
      // Companies can only update their own information
      else if (req.user.role === 'company' && req.user.id === parseInt(id)) {
        if (name) updateData.name = name;
        if (walletAddress !== undefined) updateData.walletAddress = walletAddress;
      } else {
        return res.status(403).json({
          message: 'You can only update your own company information'
        });
      }
      
      const company = await prisma.company.update({
        where: { id: parseInt(id) },
        data: updateData,
        select: {
          id: true,
          name: true,
          walletAddress: true,
          approved: true,
          createdAt: true,
          updatedAt: true,
          // Exclude password
        },
      });
      
      res.status(200).json(company);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.approveCompany = async (req, res) => {
    try {
      const { id } = req.params;
      const { approved } = req.body;
      
      // Validate that approved is a boolean
      if (typeof approved !== 'boolean') {
        return res.status(400).json({ 
          message: 'Invalid input: approved must be a boolean value' 
        });
      }
      
      const company = await prisma.company.update({
        where: { id: parseInt(id) },
        data: { approved },
        select: {
          id: true,
          name: true,
          walletAddress: true,
          approved: true,
          createdAt: true,
          updatedAt: true,
          // Exclude password
        },
      });
      
      res.status(200).json({
        message: `Company ${approved ? 'approved' : 'unapproved'} successfully`,
        company
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Delete company
exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First delete associated sensors to avoid foreign key constraint errors
    await prisma.sensor.deleteMany({
      where: { companyId: parseInt(id) },
    });
    
    // Then delete the company
    await prisma.company.delete({
      where: { id: parseInt(id) },
    });
    
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login company and Government
exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;
    
    const company = await prisma.company.findFirst({
      where: { name },
    });
    
    if (!company) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, company.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // For a real application, you would generate a JWT token here
    
    const { password: _, ...companyWithoutPassword } = company;
    res.status(200).json({ 
      message: 'Login successful',
      company: companyWithoutPassword,
      // token: generatedToken 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};