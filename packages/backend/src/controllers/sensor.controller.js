  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  const {ethers} = require("ethers");


  // Create a new sensor
  exports.createSensor = async (req, res) => {
    try {
      const { companyId } = req.body;
      
      // Check if company exists
      const company = await prisma.company.findUnique({
        where: { id: parseInt(companyId) },
      });
      
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
      
      const sensor = await prisma.sensor.create({
        data: {
          companyId: parseInt(companyId),
        },
      });
      
      res.status(201).json(sensor);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // Report reading to the government
  exports.reportReading = async (req, res) => {
    try {
      const { sensorId, readingValue } = req.body;
      
      // Check if sensor exists
      const sensor = await prisma.sensor.findUnique({
        where: { id: parseInt(sensorId) },
      });
      
      if (!sensor) {
        return res.status(404).json({ message: 'Sensor not found' });
      }
      const abi = 
      [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_owner",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "greetingSetter",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "newGreeting",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "premium",
              "type": "bool"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "GreetingChange",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "getBeneficiary",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getContractAddress",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "greeting",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "premium",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_beneficiary",
              "type": "address"
            }
          ],
          "name": "setBeneficiary",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_newGreeting",
              "type": "string"
            }
          ],
          "name": "setGreeting",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalCounter",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "userGreetingCounter",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "stateMutability": "payable",
          "type": "receive"
        }
      ]

      const private_key = "c8d5dc986a412cdff8db791992a6af3c08d4ee3febf48c142577daca41a337bb";
      const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
      const wallet = new ethers.Wallet(private_key, provider);
      const sensor2 = await prisma.sensor.findUnique({
        where: { id: parseInt(sensorId) },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              walletAddress: true,
              approved: true,
              // Exclude password
            },
          },
        },
      }); 
      const wa = sensor2.company.walletAddress;

      const contract = new ethers.Contract(wa, abi, wallet);
      const readingMessage = JSON.stringify({
        sensor: sensorId,
        value: readingValue
      });
      const tx = await contract.setGreeting(readingMessage, { 
        value: ethers.utils.parseEther(String(readingValue)) // for ethers.js v5
      });
      // const tx = await contract.getBeneficiary();
      const receipt = await tx.wait();
      console.log(receipt);

      // Log the reading (could be replaced with proper logging)
      console.log(`New reading recorded: Sensor ${sensorId}, Value: ${readingValue}`);
      
      res.status(201).json({ 
        message: `Reading reported successfully: ${readingValue}`,
        transaction: {
          hash: receipt.hash,
          blockNumber: receipt.blockNumber
        }
      });
    } catch (error) {
      console.error('Error reporting reading:', error);
      res.status(400).json({ message: error.message });
    }
  };

// Get all sensors
exports.getAllSensors = async (req, res) => {
  try {
    const sensors = await prisma.sensor.findMany({
      include: {
        company: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
            approved: true,
            // Exclude password
          },
        },
      },
    });
    
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sensor by ID
exports.getSensorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const sensor = await prisma.sensor.findUnique({
      where: { id: parseInt(id) },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
            approved: true,
            // Exclude password
          },
        },
      },
    });
    
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }
    
    res.status(200).json(sensor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete sensor
exports.deleteSensor = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.sensor.delete({
      where: { id: parseInt(id) },
    });
    
    res.status(200).json({ message: 'Sensor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

