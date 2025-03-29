const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth.middleware');

// Company registration (renamed from register to registerCompany)
exports.registerCompany = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Check if company already exists
    const existingCompany = await prisma.company.findFirst({
      where: { name },
    });

    if (existingCompany) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await prisma.company.create({
      data: {
        name,
        password: hashedPassword,
        approved: false, // Default to false, government will approve later
      },
    });

    // Remove password from response
    const { password: _, ...companyWithoutPassword } = company;

    res.status(201).json({
      message: 'Registration successful. Waiting for government approval.',
      company: companyWithoutPassword,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login (for both government and companies)
exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Validate request
    if (!name || !password) {
      return res
        .status(400)
        .json({ message: 'Name and password are required' });
    }

    // Check if it's the government master user
    if (name === process.env.GOVERNMENT_USERNAME) {
      // Verify government password (stored in env variables for security)
      if (password === process.env.GOVERNMENT_PASSWORD) {
        const token = jwt.sign(
          {
            id: 'government',
            name: 'Government',
            role: 'government',
          },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        return res.status(200).json({
          message: 'Government login successful',
          user: { name: 'Government', role: 'government' },
          token,
        });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    // If not government, try company login
    const company = await prisma.company.findFirst({
      where: { name },
    });

    if (!company) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, company.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if company is approved
    if (!company.approved) {
      return res.status(403).json({
        message:
          'Account not approved yet. Please wait for government approval.',
      });
    }

    // Generate JWT token with role information
    const token = jwt.sign(
      {
        id: company.id,
        name: company.name,
        role: 'company',
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...companyWithoutPassword } = company;

    res.status(200).json({
      message: 'Login successful',
      user: { ...companyWithoutPassword, role: 'company' },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user profile (for both government and companies)
exports.getProfile = async (req, res) => {
  try {
    // Check if government
    if (req.user.role === 'government') {
      return res.status(200).json({
        id: 'government',
        name: 'Government',
        role: 'government',
      });
    }

    // If company, get from database
    const companyId = req.user.id;

    const company = await prisma.company.findUnique({
      where: { id: parseInt(companyId) },
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

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ ...company, role: 'company' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change password (preserve from original file)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Government user can't change password through API
    if (req.user.role === 'government') {
      return res.status(403).json({
        message:
          'Government password cannot be changed through API. Update environment variables instead.',
      });
    }

    // For company users
    const company = await prisma.company.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      company.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.company.update({
      where: { id: parseInt(userId) },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
