const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
  res.json({ message: 'Cat Smart Rental API is running!' });
});

// GET all Assets
app.get('/api/assets', async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      include: { customer: true }
    });
    // Map the data slightly to match the frontend types (coordinates array)
    const formattedAssets = assets.map(asset => ({
      ...asset,
      customerName: asset.customer.name,
      coordinates: [asset.lat, asset.lng]
    }));
    res.json(formattedAssets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// GET all Customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET all Alerts
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { timestamp: 'desc' }
    });
    res.json(alerts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// PUT Transfer Asset
app.put('/api/assets/:id/transfer', async (req, res) => {
  const { id } = req.params;
  const { toCustomerId } = req.body;

  try {
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) return res.status(404).json({ error: 'Asset not found' });

    const toCustomer = await prisma.customer.findUnique({ where: { id: toCustomerId } });
    if (!toCustomer) return res.status(404).json({ error: 'Customer not found' });

    // Decrease from old customer
    await prisma.customer.update({
      where: { id: asset.customerId },
      data: { totalAssets: { decrement: 1 } }
    });

    // Increase for new customer
    await prisma.customer.update({
      where: { id: toCustomerId },
      data: { totalAssets: { increment: 1 }, activeRentals: { increment: 1 } }
    });

    const updatedAsset = await prisma.asset.update({
      where: { id },
      data: {
        customerId: toCustomerId,
        location: toCustomer.location,
        status: 'Running',
        daysIdle: 0
      }
    });

    res.json(updatedAsset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to transfer asset' });
  }
});

// PUT Check In/Out Asset
app.put('/api/assets/:id/checkinout', async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'checkin' | 'checkout'

  try {
    const asset = await prisma.asset.findUnique({ where: { id } });
    if (!asset) return res.status(404).json({ error: 'Asset not found' });

    const newStatus = action === 'checkin' ? 'Idle' : 'Running';

    await prisma.customer.update({
      where: { id: asset.customerId },
      data: {
        activeRentals: action === 'checkin' ? { decrement: 1 } : { increment: 1 }
      }
    });

    const updatedAsset = await prisma.asset.update({
      where: { id },
      data: { status: newStatus }
    });

    res.json(updatedAsset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check in/out asset' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('NOTE: Ensure your DATABASE_URL is set correctly in .env!');
});
