import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/**
 * Get bandwidth data from vnStat
 */
async function getVnstatData() {
  try {
    const { stdout } = await execAsync('vnstat --json');
    return JSON.parse(stdout);
  } catch (error) {
    console.error('vnstat error:', error.message);
    return null;
  }
}

/**
 * Get devices from ARP table
 */
async function getArpDevices() {
  try {
    const { stdout } = await execAsync('arp -a');
    const devices = [];
    const lines = stdout.split('\n');

    for (const line of lines) {
      // Parse ARP output: hostname (ip) at mac [ether] on interface
      const match = line.match(/^(\S+)\s+\((\d+\.\d+\.\d+\.\d+)\)\s+at\s+([0-9a-f:]+)/i);
      if (match) {
        const hostname = match[1] !== '?' ? match[1] : null;
        devices.push({
          ip: match[2],
          mac: match[3].toUpperCase(),
          hostname,
          download: 0, // Placeholder - accurate tracking requires iptables
          upload: 0,
        });
      }
    }
    return devices;
  } catch (error) {
    console.error('arp error:', error.message);
    return [];
  }
}

/**
 * Main API endpoint for network bandwidth data
 */
app.get('/api/network/bandwidth', async (req, res) => {
  try {
    const [vnstatData, arpDevices] = await Promise.all([
      getVnstatData(),
      getArpDevices(),
    ]);

    // Handle case where vnstat is not installed or no data yet
    if (!vnstatData || !vnstatData.interfaces || vnstatData.interfaces.length === 0) {
      return res.status(503).json({
        error: 'Network monitoring not available',
        message: 'vnStat may not be installed or has not collected data yet',
      });
    }

    const iface = vnstatData.interfaces[0];
    const traffic = iface.traffic;

    // Get today's data (last entry in day array)
    const todayData = traffic.day?.[traffic.day.length - 1];
    const today = {
      download: todayData?.rx || 0,
      upload: todayData?.tx || 0,
    };

    // Get this month's data (last entry in month array)
    const monthData = traffic.month?.[traffic.month.length - 1];
    const month = {
      download: monthData?.rx || 0,
      upload: monthData?.tx || 0,
    };

    // Calculate current rates from fiveminute data
    // vnStat stores bytes transferred in each 5-minute interval
    const fiveMinData = traffic.fiveminute || [];
    const latestFiveMin = fiveMinData[fiveMinData.length - 1];
    const downloadRate = latestFiveMin ? Math.round(latestFiveMin.rx / 300) : 0;
    const uploadRate = latestFiveMin ? Math.round(latestFiveMin.tx / 300) : 0;

    const response = {
      timestamp: new Date().toISOString(),
      interface: iface.name,
      currentRates: {
        download: downloadRate,
        upload: uploadRate,
      },
      today,
      month,
      topDevices: arpDevices.slice(0, 10),
    };

    res.json(response);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to fetch network data' });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Network monitor API running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log(`  GET /api/network/bandwidth - Network bandwidth data`);
  console.log(`  GET /api/health - Health check`);
});
