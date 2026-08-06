const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
let prisma;
try {
  prisma = new PrismaClient();
} catch (e) {
  console.log('Prisma initialized in standalone mode without active database driver adapter.');
  prisma = {
    asset: { findMany: async () => [] },
    customer: { findMany: async () => [] },
    alert: { findMany: async () => [] }
  };
}

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

const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

// GET Demand Forecast Summary
app.get('/api/forecast', (req, res) => {
  try {
    const summaryPath = path.join(__dirname, 'forecast_summary.json');
    if (fs.existsSync(summaryPath)) {
      const summaryData = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
      return res.json(summaryData);
    }
    return res.status(503).json({ error: 'Forecast model data initializing' });
  } catch (error) {
    console.error('Error serving forecast summary:', error);
    res.status(500).json({ error: 'Failed to retrieve forecast data' });
  }
});

// GET Anomaly Detection Summary
app.get('/api/anomalies', (req, res) => {
  try {
    const summaryPath = path.join(__dirname, 'forecast_summary.json');
    if (fs.existsSync(summaryPath)) {
      const summaryData = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
      if (summaryData.anomaly_summary) {
        return res.json(summaryData.anomaly_summary);
      }
    }
    return res.status(503).json({ error: 'Anomaly model data initializing' });
  } catch (error) {
    console.error('Error serving anomaly summary:', error);
    res.status(500).json({ error: 'Failed to retrieve anomaly data' });
  }
});

// POST Live Anomaly Detection Inference
app.post('/api/anomalies/predict', (req, res) => {
  const inputData = req.body || {};
  const scriptPath = path.join(__dirname, '..', 'predict_anomaly.py');
  const inputJsonString = JSON.stringify(inputData);

  execFile('python', [scriptPath, inputJsonString], (error, stdout, stderr) => {
    if (error) {
      console.error('Anomaly prediction exec error:', error, stderr);
      const idle = parseFloat(inputData.Idle_Hours) || 0;
      const is_anomaly = idle >= 30;
      return res.json({
        is_anomaly,
        severity: is_anomaly ? (idle > 45 ? 'CRITICAL' : 'WARNING') : 'NORMAL',
        misuse_type: is_anomaly ? 'EXCESSIVE_IDLE_HOURS' : 'NORMAL',
        anomaly_score: is_anomaly ? 0.85 : 0.12,
        source: 'heuristic_fallback'
      });
    }

    try {
      const result = JSON.parse(stdout.trim());
      res.json(result);
    } catch (parseErr) {
      console.error('Error parsing anomaly prediction stdout:', parseErr, stdout);
      res.status(500).json({ error: 'Failed to compute anomaly prediction' });
    }
  });
});





// POST Real-Time Live ML Prediction
app.post('/api/forecast/predict', (req, res) => {
  const inputData = req.body || {};
  const predictScriptPath = path.join(__dirname, '..', 'predict.py');

  const inputJsonString = JSON.stringify(inputData);

  execFile('python', [predictScriptPath, inputJsonString], (error, stdout, stderr) => {
    if (error) {
      console.error('Prediction exec error:', error, stderr);
      // Heuristic fallback calculation if python process fails
      const prev = parseFloat(inputData.Previous_Demand) || 50;
      const rentals = parseFloat(inputData.Current_Rentals) || 30;
      const avail = parseFloat(inputData.Available_Equipment) || 15;
      const predicted_demand = Math.round(prev * 0.6 + rentals * 0.3 + (30 - avail) * 0.4);
      
      return res.json({
        predicted_demand: Math.max(1, predicted_demand),
        inputs: inputData,
        source: 'heuristic_fallback',
        recommendation: avail < predicted_demand 
          ? `High deficit detected! Allocate ${predicted_demand - avail} additional units to ${inputData.Site || 'Site'}.` 
          : 'Sufficient equipment available.'
      });
    }

    try {
      const result = JSON.parse(stdout.trim());
      const predictedDemand = result.predicted_demand || 0;
      const avail = parseFloat(inputData.Available_Equipment) || 0;
      
      result.recommendation = avail < predictedDemand
        ? `Deficit warning! Projected demand is ${predictedDemand} units, but only ${avail} units are available at ${inputData.Site || 'Site'}. Dispatch ${Math.ceil(predictedDemand - avail)} extra units.`
        : `Stock optimal! Available stock (${avail}) covers projected demand (${predictedDemand}).`;
      
      res.json(result);
    } catch (parseErr) {
      console.error('Error parsing prediction stdout:', parseErr, stdout);
      res.status(500).json({ error: 'Failed to compute prediction' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('NOTE: Ensure your DATABASE_URL is set correctly in .env!');
});

